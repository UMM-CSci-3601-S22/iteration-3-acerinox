package umm3601.shoppinglist;

import static com.mongodb.client.model.Sorts.ascending;

import java.util.ArrayList;
import java.util.Arrays;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Projections;

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
        ArrayList<ShoppingListItem> returnedShoppingListItems = shoppingListCollection
                .aggregate(
                        Arrays.asList(
                                Aggregates.lookup("products", "product", "_id", "productData"),
                                Aggregates.sort(ascending("productData.store")),
                                Aggregates.project(Projections.fields(Projections.include("product", "count")))
                                )
                                ).into(new ArrayList<>());

        ctx.json(returnedShoppingListItems);
    }
}
