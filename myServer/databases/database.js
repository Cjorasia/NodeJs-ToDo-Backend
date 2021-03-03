import Sequelize from 'sequelize';
export const sequelize = new Sequelize( 

    'postgres', 
    'postgres',
    '1234567',  
    {
        dialect: 'postgres',
        host: 'localhost',
        operatorsAliases: 0, // false
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        }
    });

export const Op = Sequelize.Op;

