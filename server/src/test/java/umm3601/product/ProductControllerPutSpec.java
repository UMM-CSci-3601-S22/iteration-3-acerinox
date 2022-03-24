package umm3601.product;

import static com.mongodb.client.model.Filters.eq;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;
import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJackson;

/**
 * Tests the logic of the ProductController
 *
 * @throws IOException
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber", "NoWhitespaceAfter", "LineLength" })
public class ProductControllerPutSpec {
  // Mock requests and responses that will be reset in `setupEach()`
  // and then (re)used in each of the tests.
  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private ProductController productController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId milksId;

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
            .applyToClusterSettings(builder -> builder
                .hosts(Arrays.asList(new ServerAddress(mongoAddr))))
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
    List<Document> testProducts = new ArrayList<>();
    testProducts.add(
        new Document()
            .append("product_name", "Banana")
            .append("description", "A yellow fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Willies")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>(Arrays
                .asList(new String[] { "yellow fruit", "potassium" })))
            .append("lifespan", 4)
            .append("threshold", 40));
    testProducts.add(
        new Document()
            .append("product_name", "Canned Pinto Beans")
            .append("description", "A can of pinto beans")
            .append("brand", "Our Family")
            .append("category", "canned goods")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 2000)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>(Arrays.asList(new String[] {
                "canned food", "non-perishable", "beans" })))
            .append("lifespan", 4)
            .append("threshold", 4));
    testProducts.add(
        new Document()
            .append("product_name", "Bread")
            .append("description", "You know what this is.")
            .append("brand", "Richard's Castle")
            .append("category", "bakery")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>(Arrays.asList(
                new String[] { "Yeast", "contains gluten", "toast" })))
            .append("lifespan", 2)
            .append("threshold", 3));
    testProducts.add(
        new Document()
            .append("product_name", "Rock")
            .append("description", "")
            .append("brand", "Hurt Ball")
            .append("category", "miscellaneous")
            .append("store", "Co-op")
            .append("location", "")
            .append("lifespan", "")
            .append("image", "")
            .append("notes", "")
            .append("tags", new ArrayList<String>() {
            })
            .append("lifespan", 6)
            .append("threshold", 0));

    milksId = new ObjectId();
    Document milk = new Document()
        .append("_id", milksId)
        .append("product_name", "Milk")
        .append("description",
            "A dairy liquid obtained from the teat of an unsuspecting animal")
        .append("brand", "Gerbil Goods")
        .append("category", "dairy")
        .append("store", "Co-op")
        .append("location", "They're In the Walls")
        .append("lifespan", 14)
        .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
        .append("notes", "check on gerbils every 3 days")
        .append("tags", new ArrayList<String>(
            Arrays.asList(new String[] { "dairy", "perishable", "cold storage" })))
        .append("lifespan", 4)
        .append("threshold", 2);

    productDocuments.insertMany(testProducts);
    productDocuments.insertOne(milk);

    productController = new ProductController(db);
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
  public void testEditingItem() {
    String testId = milksId.toHexString();

    String testNewProduct = "{"
        + "\"_id\": \"" + testId + "\","
        + "\"product_name\": \"Other Milk\","
        + "\"description\":\"A dairy liquid obtained from the teat of an unsuspecting animal\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": [\"test tag\"],"
        + "\"lifespan\": 10,"
        + "\"threshold\": 84,"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";

    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("PUT");

    Context ctx = mockContext("api/products/{id}", Map.of("id", milksId.toHexString()));
    productController.editProduct(ctx);

    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();

    assertEquals(HttpURLConnection.HTTP_CREATED, mockRes.getStatus());

    // Make sure that the id of the newly edited product doesn't change
    assertEquals(milksId.toHexString(), id);
    assertEquals(1, db.getCollection("products").countDocuments(eq("_id", milksId)));

    // Verify that the product was added to the database with the correct ID
    Document addedProduct = db.getCollection("products").find(eq("_id", new ObjectId(id))).first();

    assertNotNull(addedProduct);
    assertEquals("Other Milk", addedProduct.getString("product_name"));
    assertEquals("A dairy liquid obtained from the teat of an unsuspecting animal",
        addedProduct.getString("description"));
    assertEquals("test brand", addedProduct.getString("brand"));
    assertEquals("test category", addedProduct.getString("category"));
    assertEquals("test store", addedProduct.getString("store"));
    assertEquals("test location", addedProduct.getString("location"));
    assertEquals("tastes like test", addedProduct.getString("notes"));
    assertEquals(10, addedProduct.getInteger("lifespan"));
    assertEquals(84, addedProduct.getInteger("threshold"));
    assertTrue(addedProduct.containsKey("image"));

  }

}
