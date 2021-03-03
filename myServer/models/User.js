import Sequelize from 'sequelize';
import { sequelize } from '../databases/database';
import Todo from './Todo';

const User = sequelize.define('user',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    profileurl: {
        type: Sequelize.STRING
    },
    gender:{
        type: Sequelize.STRING
    },
    dob: {
        type: Sequelize.DATE
    }
},{
    // dont add time stamp attribute i.e crated at or updated at
    timestamps: false,
});

// Relation 
User.hasMany(Todo, {foreignKey: 'userid', sourceKey: 'id'});
Todo.belongsTo(User, { foreignKey: 'userid', targetKey: 'id'});

export default User;
