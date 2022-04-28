package umm3601.shoppinglist;

import static com.mongodb.client.model.Sorts.ascending;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Variable;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.bson.conversions.Bson;
import org.bson.UuidRepresentation;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.Context;
import umm3601.product.Product;

public class ShoppingListController {

  private final JacksonMongoCollection<ShoppingListItem> shoppingListCollection;
  private final JacksonMongoCollection<Product> productCollection;

  public ShoppingListController(MongoDatabase database) {
    shoppingListCollection = JacksonMongoCollection.builder().build(
        database,
        "shoppingList",
        ShoppingListItem.class,
        UuidRepresentation.STANDARD);

    productCollection = JacksonMongoCollection.builder().build(
        database,
        "products",
        Product.class,
        UuidRepresentation.STANDARD);
  }

  public void resetShoppingList(Context ctx) {

    List<Variable<String>> let = new ArrayList<>(
        Arrays.asList(
            new Variable<String>("productId", "$_id"),
            new Variable<String>("productThreshold", "$threshold")));

    String compareCommand = " {$and: [ { $eq: [\"$_id\", \"$productId\"] },"
        + " { $lt: [ \"$count\", \"$productThreshold\" ] } ]  } ";

    ArrayList<ResetShoppingListItem> output = productCollection.aggregate(
        Arrays.asList(
            Aggregates.lookup("pantry",
                let,
                new ArrayList<Bson>(Arrays.asList(
                    Aggregates.group("$product", Accumulators.sum("count", 1)),
                    Aggregates.project(
                        Projections.fields(Projections.include("count"),
                            Projections.computed("productId", "$$productId"),
                            Projections.computed("productThreshold", "$$productThreshold"))),
                    Aggregates.match(Filters.expr(Document.parse(compareCommand))))),
                "outputProducts")),
        ResetShoppingListItem.class).into(new ArrayList<>());

    List<ShoppingListItem> convertedOutput = output.stream().map(ShoppingListController::convertQueryOutput)
        .collect(Collectors.toList());

    shoppingListCollection.drop();
    shoppingListCollection.insertMany(convertedOutput);

    ctx.json(convertedOutput);
  }

  private static ShoppingListItem convertQueryOutput(ResetShoppingListItem i) {
    ShoppingListItem output = new ShoppingListItem();
    output.product = new ObjectId(i._id).toHexString();
    if (i.outputProducts.size() > 0) {
      int inventoryDifference = i.threshold - i.outputProducts.get(0).count;
      output.count = inventoryDifference > 0 ? inventoryDifference : 0;
    } else {
      output.count = i.threshold;
    }
    return output;
  }

  public void getAllShoppingListItems(Context ctx) {
    ArrayList<Document> returnedShoppingListItems = shoppingListCollection
        .aggregate(
            Arrays.asList(
                Aggregates.lookup("products", "product", "_id", "productData"),
                Aggregates.unwind("$productData"),
                Aggregates.group("$productData.store", Accumulators.addToSet("products",
                    new Document("productName", "$productData.productName")
                        .append("location", "$productData.location")
                        .append("count", "$count"))),
                Aggregates.project(Projections.fields(
                    Projections.computed("store", "$_id"),
                    Projections.include("products"),
                    Projections.excludeId())),
                Aggregates.sort(ascending("store"))),
            Document.class)
        .into(new ArrayList<>());

    ctx.json(returnedShoppingListItems);
  }
}
