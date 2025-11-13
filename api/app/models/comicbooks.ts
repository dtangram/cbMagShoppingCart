import { Sequelize, DataTypes as SequelizeDataTypes, Model, Optional } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ComicBooksAttributes {
  id: number;
  title: string;
  publisher: string;
  year: number;
  userId: number;
  questionId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ComicBooksCreationAttributes extends Optional<ComicBooksAttributes, 'id' | 'createdAt' | 'updatedAt' | 'questionId'> {}

export interface ComicBooksInstance extends Model<ComicBooksAttributes, ComicBooksCreationAttributes>, ComicBooksAttributes {}

export interface ComicBooksModel {
  findAll: (options?: any) => Promise<ComicBooksInstance[]>;
  findByPk: (id: number) => Promise<ComicBooksInstance | null>;
  findOne: (options?: any) => Promise<ComicBooksInstance | null>;
  create: (values: ComicBooksCreationAttributes) => Promise<ComicBooksInstance>;
  update: (values: Partial<ComicBooksAttributes>, options: any) => Promise<[number]>;
  destroy: (options: any) => Promise<number>;
  count: (options?: any) => Promise<number>;
  associate?: (models: any) => void;
}

// ============================================================================
// MODEL DEFINITION (FUNCTIONAL)
// ============================================================================

const initComicBooksModel = (
  sequelize: Sequelize,
  DataTypes: typeof SequelizeDataTypes
): ComicBooksModel => {
  const ComicBooks = sequelize.define<ComicBooksInstance>(
    'ComicBooks',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title is required',
          },
          len: {
            args: [1, 255],
            msg: 'Title must be between 1 and 255 characters',
          },
        },
      },
      publisher: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Publisher is required',
          },
          len: {
            args: [1, 255],
            msg: 'Publisher must be between 1 and 255 characters',
          },
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Year must be an integer',
          },
          min: {
            args: [1900],
            msg: 'Year must be 1900 or later',
          },
          max: {
            args: [new Date().getFullYear() + 1],
            msg: `Year cannot be later than ${new Date().getFullYear() + 1}`,
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        validate: {
          isInt: {
            msg: 'User ID must be an integer',
          },
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'Question ID must be an integer',
          },
        },
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
      tableName: 'comic_books',
      timestamps: true,
    }
  ) as unknown as ComicBooksModel;

  ComicBooks.associate = (models: any): void => {
    if (models.Users) {
      (ComicBooks as any).belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  };

  return ComicBooks;
};

export default initComicBooksModel;