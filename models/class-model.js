const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    Name: {
        type: String,
        required: true
    },
    classicon: {
        type: String,
        required: true
    },
    MainImg: {
        type: String,
        required: true
    },
    Info: {
        type: String,
        required: true
    },

    redemblem: {
        type: String,
        required: true
    },
    bluemblem: {
        type: String,
        required: true
    },

    HP: {
        type: String,
        required: true
    },
    oHP: {
        type: String,
        required: true
    },
    SPD: {
        type: String,
        required: true
    },

    prim: {
        type: String,
        required: true
    },
    primImg: {
        type: String,
        required: true
    },
    AmmoLoaded: {
        type: String,
        required: true
    },
    TotalAmmo: {
        type: String,
        required: true
    },
    BaseDmg: {
        type: String,
        required: true
    },
    Extra1: {
        type: String,
        rqeuired: false
    },
    CritDmg: {
        type: String,
        required: true
    },

    sec: {
        type: String,
        required: false
    },
    secImg: {
        type: String,
        required: false
    },
    SAmmoLoaded: {
        type: String,
        required: false
    },
    STotalAmmo: {
        type: String,
        required: false
    },
    SBaseDmg: {
        type: String,
        required: false
    },
    SCritDmg: {
        type: String,
        required: false
    },
    SExtra1: {
        type: String,
        required: false
    },
    SExtra2: {
        type: String,
        required: false
    },
    SExtra3: {
        type: String,
        required: false
    },
    Melee: {
        type: String,
        required: true
    },
    MImg: {
        type: String,
        required: true
    },
    MBaseDmg: {
        type: String,
        required: true
    },
    MCritDmg: {
        type: String,
        required: true
    },

    SpW: {
        type: Array,
        required: false
    },

    SpName:{
        type: String,
        required: false
    },

    Special: {
        type: Array,
        required: false
    },

    Comments: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('Class', classSchema);