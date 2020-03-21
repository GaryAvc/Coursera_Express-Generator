const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// mongoose currency
// load this new currency type into mongoose
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const dishSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required :  true
    },
    image:{
        type : String,
        required: true
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        // 这里用到了 之前导入的 currency
        type:Currency,
        required:true,
        min: 0
    },
    feature:{
        type:Boolean,
        default:false
    },
    // -- sub-document --
    // save all the comments as array
    comments: [ commentSchema ]
},{
    // 自动把所有的timestamps加入到所有的schema类别中
    timestamps:true
});

// 创建一个export用的model
// 'Dish'会被map into a collection 'Dishes'
//  -她会自己把你弄成复述
var Dishes = mongoose.model('Dish',dishSchema);

module.exports = Dishes;