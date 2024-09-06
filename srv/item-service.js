// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function() {
//     const { Items } = this.entities;
//     // const srv = await cds.connect.to({
//     //     ind: 'sqlite', credentials: { url: 'db.sqlite' }
//     // });

//     //await cds.db.run();

//     this.on("selectSpecificQuantity", Items, async (req) => {
//         const { quantity } = req.data;
//         const selectedItems = await SELECT.from(Items).where({ quantity });
//         return selectedItems;
//     });

//     this.on("createNewItem", Items, async (req) => {
//         const { title, description, quantity } = req.data;
//         const createdItems = INSERT.into(Items).entries({ title, description, quantity, });
//         return createdItems;
//     });

//     this.on("CREATE", Items, async (req) => {
//         const { item } = req.data;
 
//         if (item.quantity > 100 || item.quantity < 0) {
//             return req.error("Quantity exceeds 100");
//         } else {
//             await INSERT.into(Items).entries(item);
//         }
//     });
// });

const cds = require('@sap/cds');

class ItemService extends cds.ApplicationService {

    init() {
        const { Items } = this.entities;

        this.on('selectSpecificQuantity', this.selectSpecificQuantityImpl);
        this.on('createNewItem', this.createNewItemImpl);
        this.on("CREATE", Items, this.createImpl);

        return super.init();
    }

    async selectSpecificQuantityImpl(req) {
        const { Items } = this.entities;
        const { quantity } = req.data;

        const selectedItems = await SELECT.from(Items).where({ quantity });
        return selectedItems;
    }

    async createNewItemImpl(req) {
        const { Items } = this.entities;
        const { title, description, quantity } = req.data;

        const createdItems = INSERT.into(Items).entries({ title, description, quantity, });
        return createdItems;  
    } 

    async createImpl(req) {
        const { Items } = this.entities;
        const { item } = req.data;
 
        if (item.quantity > 100 || item.quantity < 0) {
            return req.error("Quantity exceeds 100");
        } else {
            await INSERT.into(Items).entries(item);
        }
    }
}

module.exports = ItemService;