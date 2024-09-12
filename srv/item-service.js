const cds = require('@sap/cds');

class ItemService extends cds.ApplicationService {

    init() {
        const { Items } = this.entities;

        this.on('selectSpecificQuantity', this.selectSpecificQuantityImpl);
        this.on('createNewItem', this.createNewItemImpl);
        this.on('getRemoteData', this.getRemoteDataImpl);
        this.on('getLocalData', this.getLocalDataImpl);
        this.on('getNorthData', this.getNorthDataImpl);
        this.on("CREATE", Items, this.createImpl);

        return super.init();
    }

    async selectSpecificQuantityImpl(req) {
        const { Items } = this.entities;
        const { quantity } = req.data;

        try {
            if (quantity == null || isNaN(quantity)) {
                return req.error(400, "Invalid quantity value.");
            }

            const selectedItems = await SELECT.from(Items).where({ quantity });
            
            if (selectedItems.length === 0) {
                return req.error(404, "No items found with the specified quantity.");
            }

            return selectedItems;
        } catch (error) {
            console.error("Error selecting items:", error);
            return req.error(500, "Internal server error while selecting items.");
        }
    }

    async createNewItemImpl(req) {
        const { Items } = this.entities;
        const { title, description, quantity } = req.data;

        try {
            if (!title || !description || quantity == null || isNaN(quantity) || quantity < 0) {
                return req.error(400, "Invalid input data.");
            }

            const createdItems = await INSERT.into(Items).entries({ title, description, quantity });

            return createdItems;
        } catch (error) {
            console.error("Error creating new item:", error);
            return req.error(500, "Internal server error while creating a new item.");
        }
    }

    async createImpl(req) {
        const { Items } = this.entities;
        const { item } = req.data;

        try {
            if (!item || !item.quantity || isNaN(item.quantity)) {
                return req.error(400, "Invalid item data.");
            }

            if (item.quantity > 100 || item.quantity < 0) {
                return req.error(400, "Quantity must be between 0 and 100.");
            }

            await INSERT.into(Items).entries(item);
            return { message: "Item created successfully." };
        } catch (error) {
            console.error("Error creating item:", error);
            return req.error(500, "Internal server error while creating item.");
        }
    }

    async getRemoteDataImpl(req) {
        const GMAPIsrv = await cds.connect.to('GoogleMapsAPI');
        const response = await GMAPIsrv.send({
            method: 'GET',
            headers: {
                apikey: process.env.GMapikey,
            },
        });

        console.log(response);

        return response;
    };

    async getLocalDataImpl(req) {
        const Premisesrv = await cds.connect.to('MyPremises');
        const response = await Premisesrv.get('/');

        console.log(response);
        return response;
    };

    async getNorthDataImpl(req) {
        const Northsrv = await cds.connect.to('Noirthwind');
        const response = await Northsrv.send({
            method: 'GET',
            url: '/Northwind/Northwind.svc/Customers',
        });

        console.log(response);
        return response;
    };
}

module.exports = ItemService;
