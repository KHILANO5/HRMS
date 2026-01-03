// Audit Log Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface AuditLogAttributes {
  id: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: object;
  newValues?: object;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export const initAuditLogModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'AuditLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'entity_type',
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'entity_id',
      },
      oldValues: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'old_values',
      },
      newValues: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'new_values',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'user_agent',
      },
    },
    {
      tableName: 'audit_logs',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['created_at'] },
        { fields: ['entity_type'] },
      ],
    }
  );
};
