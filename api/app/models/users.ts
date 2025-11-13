import { Sequelize, DataTypes as SequelizeDataTypes, Model, Optional } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UsersAttributes {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id' | 'password' | 'createdAt' | 'updatedAt'> {}

export interface UsersInstance extends Model<UsersAttributes, UsersCreationAttributes>, UsersAttributes {}

export interface UsersModel {
  findAll: (options?: any) => Promise<UsersInstance[]>;
  findByPk: (id: string) => Promise<UsersInstance | null>;
  findOne: (options?: any) => Promise<UsersInstance | null>;
  create: (values: UsersCreationAttributes) => Promise<UsersInstance>;
  update: (values: Partial<UsersAttributes>, options: any) => Promise<[number]>;
  destroy: (options: any) => Promise<number>;
  count: (options?: any) => Promise<number>;
  associate?: (models: any) => void;
}

// ============================================================================
// MODEL DEFINITION (FUNCTIONAL)
// ============================================================================

const initUsersModel = (
  sequelize: Sequelize,
  DataTypes: typeof SequelizeDataTypes
): UsersModel => {
  const Users = sequelize.define<UsersInstance>(
    'Users',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
          isUUID: {
            args: 4,
            msg: 'ID not valid, please try again.',
          },
        },
      },
      firstname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'First name is required',
          },
          len: {
            args: [1, 100],
            msg: 'First name must be between 1 and 100 characters',
          },
        },
      },
      lastname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Last name is required',
          },
          len: {
            args: [1, 100],
            msg: 'Last name must be between 1 and 100 characters',
          },
        },
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Username is required',
          },
          len: {
            args: [3, 50],
            msg: 'Username must be between 3 and 50 characters',
          },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Email is required',
          },
          isEmail: {
            msg: 'Must be a valid email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  ) as unknown as UsersModel;

  Users.associate = (models: any): void => {
    if (models.ComicBooks) {
      (Users as any).hasMany(models.ComicBooks, {
        foreignKey: 'userId',
        as: 'comicBooks',
      });
    }
  };

  return Users;
};

export default initUsersModel;