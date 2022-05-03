package umm3601.shoppinglist;

import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

@SuppressWarnings({ "MagicNumber" })
public class ShoppingListGenerationSpec {

  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private ShoppingListController shoppingListController;

  private ObjectId appleProductId;
  private ObjectId bananaProductId;
  private ObjectId beansProductId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;

  private static JavalinJackson javalinJackson = new JavalinJackson();

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
    mockReq.resetAll();
    mockRes.resetAll();

    MongoCollection<Document> shoppingListDocuments = db.getCollection("shoppingList");
    shoppingListDocuments.drop();

    MongoCollection<Document> productsDocuments = db.getCollection("products");
    productsDocuments.drop();

    MongoCollection<Document> pantryDocuments = db.getCollection("pantry");
    pantryDocuments.drop();

    List<Document> testProducts = new ArrayList<>();
    bananaProductId = new ObjectId();
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
                addAll(Arrays.asList(new String[] {"yellow fruit", "potassium"}));
              }
            })
            .append("lifespan", 4)
            .append("threshold", 40));
    beansProductId = new ObjectId();
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
                addAll(Arrays.asList(new String[] {"canned food", "non-perishable", "beans"}));
              }
            })
            .append("lifespan", 4)
            .append("threshold", 0));
    appleProductId = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", appleProductId)
            .append("productName", "apple")
            .append("description", "A red fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Other Store")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new ArrayList<String>() {
              {
                addAll(Arrays.asList(new String[] {"yellow fruit", "potassium"}));
              }
            })
            .append("lifespan", 4)
            .append("threshold", 40));

    productsDocuments.insertMany(testProducts);

    List<Document> testPantryItems = new ArrayList<>();
    testPantryItems.add(
        new Document()
            .append("product", appleProductId)
            .append("notes", "Some notes")
            .append("purchase_date", "01/01/2020"));
    testPantryItems.add(
        new Document()
            .append("product", appleProductId)
            .append("notes", "apple 2")
            .append("purchase_date", "01/01/2022"));
    testPantryItems.add(
        new Document()
            .append("product", beansProductId)
            .append("notes", "beans 1")
            .append("purchase_date", "01/01/2020"));
    testPantryItems.add(
        new Document()
            .append("product", bananaProductId)
            .append("notes", "banana 1")
            .append("purchase_date", "01/01/2020"));
    pantryDocuments.insertMany(testPantryItems);

    shoppingListController = new ShoppingListController(db);

  }

  private Context mockContext(String path) {
    return mockContext(path, Collections.emptyMap());
  }

  private Context mockContext(String path, Map<String, String> pathParams) {
    Context initialContext = ContextUtil.init(
        mockReq, mockRes,
        path,
        pathParams,
        HandlerType.INVALID,
        Map.ofEntries(
            entry(JSON_MAPPER_KEY, javalinJackson),
            entry(ContextUtil.maxRequestSizeKey,
                new JavalinConfig().maxRequestSize)));
    return initialContext;
  }

  private Document[] returnedShoppingListItems(Context ctx) {
    String result = ctx.resultString();
    Document[] shoppingListItems = javalinJackson.fromJsonString(result, Document[].class);
    return shoppingListItems;
  }

  @Test
  public void canGenerateShoppingList() throws IOException {

    mockReq.setMethod("PUT");

    Context ctx = mockContext("api/shoppinglist");
    shoppingListController.resetShoppingList(ctx);

    Document[] returnedShoppingListItems = returnedShoppingListItems(ctx);

    HashMap<String, Integer> expectedCounts = new HashMap<>(
        Map.ofEntries(
            entry(appleProductId.toHexString(), 38),
            entry(beansProductId.toHexString(), 0),
            entry(bananaProductId.toHexString(), 39)));

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());
    for (Document item : returnedShoppingListItems) {
      assertEquals(expectedCounts.get(item.get("product")), item.get("count"));
    }
  }
}
