package umm3601.shoppinglist;

import static com.mongodb.client.model.Sorts.ascending;

import java.util.ArrayList;
import java.util.Arrays;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Projections;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.Context;

public class ShoppingListController {

    private final JacksonMongoCollection<ShoppingListItem> shoppingListCollection;

    public ShoppingListController(MongoDatabase database) {
        shoppingListCollection = JacksonMongoCollection.builder().build(
                database,
                "shoppingList",
                ShoppingListItem.class,
                UuidRepresentation.STANDARD);
    }

    public void getAllShoppingListItems(Context ctx) {
        ArrayList<Document> returnedShoppingListItems = shoppingListCollection
                .aggregate(
                        Arrays.asList(
                                Aggregates.lookup("products", "product", "_id", "productData"),
                                Aggregates.unwind("$productData"),
                                Aggregates.group("$productData.store", Accumulators.addToSet("products",
                                new Document("productName", "$productData.productName")
                                .append("location", "$productData.location")))),
                                /*
                                Aggregates.project(Projections.fields(
                                  Projections.include("count"),
                                  Projections.computed("productName", "$productData.productName"),
                                  Projections.computed("location", "$productData.location")))
                                )
                                */
                                Document.class
                                ).into(new ArrayList<>());

        ctx.json(returnedShoppingListItems);
    }
}