export default class User{
    constructor(uid, displayName){
        this.uid = uid;
        this.displayName = displayName;
        this.allTime = 0;
        this.rounds = [];
    }
}