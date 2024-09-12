using {riskmanagement as rm} from '../db/schema';

@path: 'service/item'
service ItemService {
    entity Items as projection on rm.Items;
    annotate Items with @odata.draft.enabled;

    function selectSpecificQuantity(quantity: Integer) returns Items;
    action createNewItem(title: String, description: String, quantity: Integer) returns Items;

    function getRemoteData() returns String;
    function getLocalData() returns String;
    function getNorthData() returns String;
}