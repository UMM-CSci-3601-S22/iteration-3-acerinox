package umm3601.product;

import static com.mongodb.client.model.Filters.eq;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;
import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.core.JavalinConfig;
import io.javalin.core.validation.ValidationException;
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJackson;

public class ProductControllerValidateProductSpec {

  // Mock requests and responses that will be reset in `setupEach()`
  // and then (re)used in each of the tests.
  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private ProductController productController;

  // The client and database that will be used
  // for all the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  /**
   * Sets up (the connection to the) DB once; that connection and DB will
   * then be (re)used for all the tests, and closed in the `teardown()`
   * method. It's somewhat expensive to establish a connection to the
   * database, and there are usually limits to how many connections
   * a database will support at once. Limiting ourselves to a single
   * connection that will be shared across all the tests in this spec
   * file helps both speed things up and reduce the load on the DB
   * engine.
   */
  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void setupEach() throws IOException {
    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> productDocuments = db.getCollection("products");
    productDocuments.drop();

    productController = new ProductController(db);
  }

  /**
   * Construct an instance of `Context` using `ContextUtil`, providing
   * a mock context in Javalin. See `mockContext(String, Map)` for
   * more details.
   */
  private Context mockContext(String path) {
    return mockContext(path, Collections.emptyMap());
  }

  /**
   * Construct an instance of `Context` using `ContextUtil`, providing a mock
   * context in Javalin. We need to provide a couple of attributes, which is
   * the fifth argument, which forces us to also provide the (default) value
   * for the fourth argument. There are two attributes we need to provide:
   *
   * - One is a `JsonMapper` that is used to translate between POJOs and JSON
   * objects. This is needed by almost every test.
   * - The other is `maxRequestSize`, which is needed for all the ADD requests,
   * since `ContextUtil` checks to make sure that the request isn't "too big".
   * Those tests fails if you don't provide a value for `maxRequestSize` for
   * it to use in those comparisons.
   */
  private Context mockContext(String path, Map<String, String> pathParams) {
    return ContextUtil.init(
        mockReq, mockRes,
        path,
        pathParams,
        HandlerType.INVALID,
        Map.ofEntries(
            entry(JSON_MAPPER_KEY, javalinJackson),
            entry(ContextUtil.maxRequestSizeKey,
                new JavalinConfig().maxRequestSize)));
  }

  @Test
  public void addInvalidThresholdProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 0," // Invalid threshold
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyLifespanProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": null," // empty lifespan
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullNameProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": null," // null name
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyNameProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"\"," // empty name
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullDescriptionProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\": null," // null description
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyProductDescription() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\"," // empty name
        + "\"description\":\"\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    productController.addNewProduct(ctx);
    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();

    // Our status should be 201, i.e., our new product was successfully
    // created. This is a named constant in the class HttpURLConnection.
    assertEquals(HttpURLConnection.HTTP_CREATED, mockRes.getStatus());

    // Successfully adding the product should return the newly generated MongoDB ID
    // for that product.
    assertNotEquals("", id);
    assertEquals(1, db.getCollection("products").countDocuments(eq("_id", new ObjectId(id))));

    // Verify that the product was added to the database with the correct ID
    Document addedProduct = db.getCollection("products").find(eq("_id", new ObjectId(id))).first();

    assertEquals("", addedProduct.getString("description"));
  }

  @Test
  public void addNullBrandProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": null," // null brand
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyBrandProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"\"," // empty brand
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullCategoryProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": null," // null category
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyCategoryProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"\"," // empty category
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullStoreProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": null," // null store
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyStoreProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"\"," // empty store
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 100,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

}
