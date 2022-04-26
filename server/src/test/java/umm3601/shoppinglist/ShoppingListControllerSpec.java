package umm3601.shoppinglist;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import static java.util.Map.entry;
import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.core.JavalinConfig;
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.HttpCode;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJackson;

import com.mongodb.client.MongoDatabase;

@SuppressWarnings({ "MagicNumber", "NoWhitespaceAfter" })
public class ShoppingListControllerSpec {
  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private ShoppingListController shoppingListController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId appleEntryId;
  private ObjectId bananaEntryId;
  private ObjectId beansEntryId;

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

    // Setup productDocumentation in the database
    MongoCollection<Document> shoppingListDocuments = db.getCollection("shoppingList");
    shoppingListDocuments.drop();

    MongoCollection<Document> productsDocuments = db.getCollection("products");
    productsDocuments.drop();

    // Add test list for products to database
    List<Document> testProducts = new ArrayList<>();
    ObjectId bananaProductId = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", bananaProductId)
            .append("productName", "Banana")
            .append("description", "A yellow fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Pomme de Terre")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>() {
              {
                addAll(Arrays.asList(new String[] { "yellow fruit", "potassium" }));
              }
            })
            .append("lifespan", 4)
            .append("threshold", 40));
    ObjectId beansProductId = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", beansProductId)
            .append("productName", "Canned Pinto Beans")
            .append("description", "A can of pinto beans")
            .append("brand", "Our Family")
            .append("category", "canned goods")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 2000)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>() {
              {
                addAll(Arrays.asList(new String[] { "canned food", "non-perishable", "beans" }));
              }
            })
            .append("lifespan", 4)
            .append("threshold", 4));
    ObjectId appleProductId = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", appleProductId)
            .append("productName", "apple")
            .append("description", "A yellow fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Other Store")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>() {
              {
                addAll(Arrays.asList(new String[] { "yellow fruit", "potassium" }));
              }
            })
            .append("lifespan", 4)
            .append("threshold", 40));
    productsDocuments.insertMany(testProducts);

    // Add test list for shopping list items to database
    List<Document> testShoppingListItems = new ArrayList<>();
    appleEntryId = new ObjectId();
    testShoppingListItems.add(
      new Document()
        .append("_id", appleEntryId)
        .append("product", appleProductId)
        .append("_count", 10)
    );

    beansEntryId = new ObjectId();
    testShoppingListItems.add(
        new Document()
            .append("_id", beansEntryId)
            .append("product", beansProductId)
            .append("count", 20)
    );

    bananaEntryId = new ObjectId();
    testShoppingListItems.add(
        new Document()
            .append("_id", bananaEntryId)
            .append("product", bananaProductId)
            .append("count", 20)
    );

    shoppingListDocuments.insertMany(testShoppingListItems);

    shoppingListController = new ShoppingListController(db);
  }

    private Context mockContext(String path) {
      return mockContext(path, Collections.emptyMap());
    }

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

    private Document[] returnedShoppingListItems(Context ctx) {
      String result = ctx.resultString();
      Document[] shoppingListItems = javalinJackson.fromJsonString(result, Document[].class);
      return shoppingListItems;
    }

    @Test
  public void canGetAllShoppingListItems() throws IOException {
    // Create our fake Javalin context
    String path = "api/shoppinglist";
    Context ctx = mockContext(path);

    shoppingListController.getAllShoppingListItems(ctx);
    Document[] returnedShoppingListItems = returnedShoppingListItems(ctx);

    // The response status should be 200, i.e., our request
    // was handled successfully (was OK). This is a named constant in
    // the class HttpCode.
    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(
        db.getCollection("shoppingList").countDocuments(),
        returnedShoppingListItems.length);
  }

  @Test
  public void addItem() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"count\": 5"
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/shoppinglist");

    shoppingListController.addNewShoppingListItem(ctx);
    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();

    // Our status should be 201, i.e., our new shoppinglist item was successfully
    // created. This is a named constant in the class HttpURLConnection.
    assertEquals(HttpURLConnection.HTTP_CREATED, mockRes.getStatus());

    // Successfully adding the shopping list item should return the newly generated MongoDB ID
    // for that item.
    assertNotEquals("", id);
    assertEquals(1, db.getCollection("shoppinglist").countDocuments(eq("_id", new ObjectId(id))));

    // Verify that the product was added to the database with the correct ID
    Document addedShoppingListItem = db.getCollection("shoppinglist").find(eq("_id", new ObjectId(id))).first();

    assertNotNull(addedShoppingListItem);
    assertEquals(bananaEntryId.toHexString(), addedShoppingListItem.getString("product"));
    assertEquals(5, addedShoppingListItem.getString("count"));
  }
}


