import { Sequelize, DataTypes as SequelizeDataTypes } from 'sequelize';
import path from 'path';
import fs from 'fs';
import initComicBooksModel, { ComicBooksModel } from './comicbooks';
import initUsersModel, { UsersModel } from './users';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Config {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';
  use_env_variable?: string;
}

export interface DatabaseModels {
  ComicBooks: ComicBooksModel;
  Users: UsersModel;
  sequelize: Sequelize;
  SequelizeDataTypes: typeof SequelizeDataTypes;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', 'config', 'config.json');

let config: Config;
try {
  const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config = configFile[env];
} catch (error) {
  // Fallback to environment variables if config.json doesn't exist
  config = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'comics_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  };
}

// ============================================================================
// SEQUELIZE INITIALIZATION
// ============================================================================

const createSequelizeInstance = (config: Config): Sequelize => {
  if (config.use_env_variable) {
    const connectionString = process.env[config.use_env_variable];
    if (!connectionString) {
      throw new Error(`Environment variable ${config.use_env_variable} is not set`);
    }
    return new Sequelize(connectionString, config);
  }
  
  return new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
};

const sequelize = createSequelizeInstance(config);

// ============================================================================
// INITIALIZE MODELS
// ============================================================================

const ComicBooks = initComicBooksModel(sequelize, SequelizeDataTypes);
const Users = initUsersModel(sequelize, SequelizeDataTypes);

// ============================================================================
// CREATE DB OBJECT
// ============================================================================

const db: DatabaseModels = {
  ComicBooks,
  Users,
  sequelize,
  SequelizeDataTypes,
};

// ============================================================================
// RUN ASSOCIATIONS
// ============================================================================

const initializeAssociations = (db: DatabaseModels): void => {
  if (db.ComicBooks.associate && typeof db.ComicBooks.associate === 'function') {
    db.ComicBooks.associate(db);
  }

  if (db.Users.associate && typeof db.Users.associate === 'function') {
    db.Users.associate(db);
  }
};

initializeAssociations(db);

// ============================================================================
// EXPORTS
// ============================================================================

export default db;
export { ComicBooks, Users, sequelize, SequelizeDataTypes };