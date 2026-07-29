"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
exports.seedRoles = seedRoles;
exports.seedSuperAdminUser = seedSuperAdminUser;
exports.seedAll = seedAll;
const bcrypt_1 = __importDefault(require("bcrypt"));
const permission_model_1 = require("./modules/permission/permission.model");
const role_model_1 = require("./modules/role/role.model");
const auth_model_1 = require("./modules/auth/auth.model");
const environment_1 = require("./shared/config/environment");
const logger_1 = require("./shared/logger/logger");
const SALT_ROUNDS = 12;
const permissionDefinitions = [
    { name: 'Create Warehouse', code: 'warehouse.create', module: 'warehouse', description: 'Create new warehouses' },
    { name: 'Read Warehouse', code: 'warehouse.read', module: 'warehouse', description: 'View warehouse details' },
    { name: 'Update Warehouse', code: 'warehouse.update', module: 'warehouse', description: 'Update warehouse details' },
    { name: 'Delete Warehouse', code: 'warehouse.delete', module: 'warehouse', description: 'Delete warehouses' },
    { name: 'Create Zone', code: 'zone.create', module: 'zone', description: 'Create new zones' },
    { name: 'Read Zone', code: 'zone.read', module: 'zone', description: 'View zone details' },
    { name: 'Update Zone', code: 'zone.update', module: 'zone', description: 'Update zone details' },
    { name: 'Delete Zone', code: 'zone.delete', module: 'zone', description: 'Delete zones' },
    { name: 'Create Aisle', code: 'aisle.create', module: 'aisle', description: 'Create new aisles' },
    { name: 'Read Aisle', code: 'aisle.read', module: 'aisle', description: 'View aisle details' },
    { name: 'Update Aisle', code: 'aisle.update', module: 'aisle', description: 'Update aisle details' },
    { name: 'Delete Aisle', code: 'aisle.delete', module: 'aisle', description: 'Delete aisles' },
    { name: 'Create Bin', code: 'bin.create', module: 'bin', description: 'Create new bins' },
    { name: 'Read Bin', code: 'bin.read', module: 'bin', description: 'View bin details' },
    { name: 'Update Bin', code: 'bin.update', module: 'bin', description: 'Update bin details' },
    { name: 'Delete Bin', code: 'bin.delete', module: 'bin', description: 'Delete bins' },
    { name: 'Create Device', code: 'device.create', module: 'device', description: 'Register new devices' },
    { name: 'Read Device', code: 'device.read', module: 'device', description: 'View device details' },
    { name: 'Update Device', code: 'device.update', module: 'device', description: 'Update device details' },
    { name: 'Delete Device', code: 'device.delete', module: 'device', description: 'Delete devices' },
    { name: 'Move Device', code: 'device.move', module: 'device', description: 'Move devices between bins' },
    { name: 'Read Inventory', code: 'inventory.read', module: 'inventory', description: 'View inventory' },
    { name: 'Move Inventory', code: 'inventory.move', module: 'inventory', description: 'Move inventory items' },
    { name: 'Create Order', code: 'order.create', module: 'order', description: 'Create new orders' },
    { name: 'Read Order', code: 'order.read', module: 'order', description: 'View order details' },
    { name: 'Update Order', code: 'order.update', module: 'order', description: 'Update order details' },
    { name: 'Cancel Order', code: 'order.cancel', module: 'order', description: 'Cancel orders' },
    { name: 'Fulfill Order', code: 'order.fulfill', module: 'order', description: 'Fulfill orders' },
    { name: 'Generate Pick List', code: 'order.generate-pick-list', module: 'order', description: 'Generate pick lists from orders' },
    { name: 'Create Pick List', code: 'pick-list.create', module: 'pick-list', description: 'Create new pick lists' },
    { name: 'Read Pick List', code: 'pick-list.read', module: 'pick-list', description: 'View pick list details' },
    { name: 'Assign Pick List', code: 'pick-list.assign', module: 'pick-list', description: 'Assign workers to pick lists' },
    { name: 'Start Pick List', code: 'pick-list.start', module: 'pick-list', description: 'Start working on a pick list' },
    { name: 'Complete Pick List', code: 'pick-list.complete', module: 'pick-list', description: 'Mark pick list as completed' },
    { name: 'Cancel Pick List', code: 'pick-list.cancel', module: 'pick-list', description: 'Cancel pick lists' },
    { name: 'Read Audit Log', code: 'audit-log.read', module: 'audit-log', description: 'View audit logs' },
    { name: 'Create Notification', code: 'notification.create', module: 'notification', description: 'Create notifications' },
    { name: 'Read Notification', code: 'notification.read', module: 'notification', description: 'View notifications' },
    { name: 'Update Notification', code: 'notification.update', module: 'notification', description: 'Update notifications' },
    { name: 'Delete Notification', code: 'notification.delete', module: 'notification', description: 'Delete notifications' },
    { name: 'View Dashboard', code: 'report.view-dashboard', module: 'report', description: 'View dashboard' },
    { name: 'View Inventory Report', code: 'report.view-inventory', module: 'report', description: 'View inventory reports' },
    { name: 'View Warehouse Utilization', code: 'report.view-warehouse-utilization', module: 'report', description: 'View warehouse utilization reports' },
    { name: 'View Device Status', code: 'report.view-device-status', module: 'report', description: 'View device status reports' },
    { name: 'View Pick List Performance', code: 'report.view-pick-list-performance', module: 'report', description: 'View pick list performance reports' },
    { name: 'View Order Status', code: 'report.view-order-status', module: 'report', description: 'View order status reports' },
    { name: 'Read Users', code: 'admin.user.read', module: 'admin', description: 'View user list and details' },
    { name: 'Create User', code: 'admin.user.create', module: 'admin', description: 'Create new users' },
    { name: 'Update User', code: 'admin.user.update', module: 'admin', description: 'Update user details' },
    { name: 'Delete User', code: 'admin.user.delete', module: 'admin', description: 'Delete users' },
    { name: 'Read Roles', code: 'role.read', module: 'role', description: 'View roles' },
    { name: 'Create Role', code: 'role.create', module: 'role', description: 'Create new roles' },
    { name: 'Update Role', code: 'role.update', module: 'role', description: 'Update roles' },
    { name: 'Delete Role', code: 'role.delete', module: 'role', description: 'Delete roles' },
    { name: 'Read Permission', code: 'permission.read', module: 'permission', description: 'View permissions' },
    { name: 'Create Permission', code: 'permission.create', module: 'permission', description: 'Create new permissions' },
    { name: 'Update Permission', code: 'permission.update', module: 'permission', description: 'Update permissions' },
    { name: 'Delete Permission', code: 'permission.delete', module: 'permission', description: 'Delete permissions' },
];
async function seedPermissions() {
    const existingCount = await permission_model_1.PermissionModel.countDocuments();
    if (existingCount > 0) {
        logger_1.logger.info(`Permissions already seeded (${existingCount} existing) — skipping`);
        return;
    }
    const permissions = await permission_model_1.PermissionModel.insertMany(permissionDefinitions);
    logger_1.logger.info({ count: permissions.length }, 'Default permissions seeded');
}
async function seedRoles() {
    const existingCount = await role_model_1.RoleModel.countDocuments();
    if (existingCount > 0) {
        logger_1.logger.info(`Roles already seeded (${existingCount} existing) — skipping`);
        return;
    }
    const allPermissions = await permission_model_1.PermissionModel.find().lean();
    const getPermIdsByCodes = (codes) => {
        return allPermissions
            .filter((p) => codes.includes(p.code))
            .map((p) => p._id.toString());
    };
    const allPermIds = allPermissions.map((p) => p._id.toString());
    const superAdminRole = await role_model_1.RoleModel.create({
        name: 'SuperAdmin',
        description: 'Super Administrator with full system access',
        permissions: allPermIds,
        isSuperAdmin: true,
    });
    const managerPermCodes = [
        'warehouse.create', 'warehouse.read', 'warehouse.update', 'warehouse.delete',
        'zone.create', 'zone.read', 'zone.update', 'zone.delete',
        'aisle.create', 'aisle.read', 'aisle.update', 'aisle.delete',
        'bin.create', 'bin.read', 'bin.update', 'bin.delete',
        'device.create', 'device.read', 'device.update', 'device.delete', 'device.move',
        'inventory.read', 'inventory.move',
        'order.create', 'order.read', 'order.update', 'order.cancel', 'order.fulfill', 'order.generate-pick-list',
        'pick-list.create', 'pick-list.read', 'pick-list.assign', 'pick-list.cancel',
        'audit-log.read',
        'notification.create', 'notification.read', 'notification.update', 'notification.delete',
        'report.view-dashboard', 'report.view-inventory', 'report.view-warehouse-utilization',
        'report.view-device-status', 'report.view-pick-list-performance', 'report.view-order-status',
    ];
    const managerRole = await role_model_1.RoleModel.create({
        name: 'Manager',
        description: 'Warehouse Manager with operational oversight',
        permissions: getPermIdsByCodes(managerPermCodes),
        isSuperAdmin: false,
    });
    const workerPermCodes = [
        'warehouse.read',
        'inventory.read',
        'order.read',
        'pick-list.read', 'pick-list.start', 'pick-list.complete',
        'report.view-dashboard',
    ];
    await role_model_1.RoleModel.create({
        name: 'Worker',
        description: 'Floor worker with task execution permissions',
        permissions: getPermIdsByCodes(workerPermCodes),
        isSuperAdmin: false,
    });
    logger_1.logger.info({
        superAdminId: superAdminRole._id.toString(),
        managerId: managerRole._id.toString(),
    }, 'Default roles seeded');
}
async function seedSuperAdminUser() {
    const userCount = await auth_model_1.UserModel.countDocuments();
    if (userCount > 0) {
        return;
    }
    const superAdminRole = await role_model_1.RoleModel.findOne({ name: 'SuperAdmin' }).lean();
    if (!superAdminRole) {
        logger_1.logger.warn('SuperAdmin role not found — skipping SuperAdmin user seed');
        return;
    }
    logger_1.logger.info('No users found — creating default Super Admin');
    const hashedPassword = await bcrypt_1.default.hash(environment_1.environment.SUPER_ADMIN_PASSWORD, SALT_ROUNDS);
    await auth_model_1.UserModel.create({
        name: environment_1.environment.SUPER_ADMIN_NAME,
        email: environment_1.environment.SUPER_ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        roleId: superAdminRole._id,
    });
    logger_1.logger.info({
        email: environment_1.environment.SUPER_ADMIN_EMAIL,
    }, 'Default Super Admin created');
}
async function seedAll() {
    await seedPermissions();
    await seedRoles();
    await seedSuperAdminUser();
}
//# sourceMappingURL=seed.js.map