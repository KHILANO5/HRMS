// User Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  isFirstLogin: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const initUserModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.ENUM('admin', 'employee'),
        allowNull: false,
        defaultValue: 'employee',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      isFirstLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_first_login',
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['email'] },
        { fields: ['role'] },
        { fields: ['is_active'] },
        { fields: ['created_at'] },
      ],
    }
  );
};
