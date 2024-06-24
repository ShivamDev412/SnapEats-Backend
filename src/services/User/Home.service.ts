import { getAllStores } from "../../dbConfig/queries/Store.query";

class HomeService {
    async getStores(lat:number, lan:number, search:String, foodTypeId:string) {
        const getAllStore = await getAllStores();
        
    }
}
export default HomeService;