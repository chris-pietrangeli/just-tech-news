const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
class User extends Model {
    //setup method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and configuration 
User.init(
    {
        //define an id column 
        id: {
            //use the special sequelize datatypes object provide what type
            type: DataTypes.INTEGER,
            //this is the equivalent of sql's not null option
            allowNull: false,
            //instruct that this is the primary key
            primaryKey: true,
            //turn on auto inc
            autoIncrement: true
        },
        //define an username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the pass must be at least 4 chars long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //Table config option go here

        //pass in our imported sequelize connection
        sequelize,
        //dont auto create createdAt/UpdatedAt
        timestamps: false,
        //dont pluralize name of database tables
        freezeTableName: true,
        //use underscores instead of camel caseing
        underscored: true,
        //make it so our model name stays lowercase in the db
        modelName: 'user'
    }
);

module.exports = User;