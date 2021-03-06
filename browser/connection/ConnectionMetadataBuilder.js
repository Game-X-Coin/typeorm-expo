import { importClassesFromDirectories } from "../util/DirectoryExportedClassesLoader";
import { OrmUtils } from "../util/OrmUtils";
import { getFromContainer } from "../container";
import { getMetadataArgsStorage } from "../index";
import { EntityMetadataBuilder } from "../metadata-builder/EntityMetadataBuilder";
import { EntitySchemaTransformer } from "../entity-schema/EntitySchemaTransformer";
import { EntitySchema } from "../entity-schema/EntitySchema";
/**
 * Builds migration instances, subscriber instances and entity metadatas for the given classes.
 */
var ConnectionMetadataBuilder = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ConnectionMetadataBuilder(connection) {
        this.connection = connection;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Builds migration instances for the given classes or directories.
     */
    ConnectionMetadataBuilder.prototype.buildMigrations = function (migrations) {
        var _a = OrmUtils.splitClassesAndStrings(migrations), migrationClasses = _a[0], migrationDirectories = _a[1];
        var allMigrationClasses = migrationClasses.concat(importClassesFromDirectories(migrationDirectories));
        return allMigrationClasses.map(function (migrationClass) { return getFromContainer(migrationClass); });
    };
    /**
     * Builds subscriber instances for the given classes or directories.
     */
    ConnectionMetadataBuilder.prototype.buildSubscribers = function (subscribers) {
        var _a = OrmUtils.splitClassesAndStrings(subscribers || []), subscriberClasses = _a[0], subscriberDirectories = _a[1];
        var allSubscriberClasses = subscriberClasses.concat(importClassesFromDirectories(subscriberDirectories));
        return getMetadataArgsStorage()
            .filterSubscribers(allSubscriberClasses)
            .map(function (metadata) { return getFromContainer(metadata.target); });
    };
    /**
     * Builds entity metadatas for the given classes or directories.
     */
    ConnectionMetadataBuilder.prototype.buildEntityMetadatas = function (entities) {
        // todo: instead we need to merge multiple metadata args storages
        var _a = OrmUtils.splitClassesAndStrings(entities || []), entityClassesOrSchemas = _a[0], entityDirectories = _a[1];
        var entityClasses = entityClassesOrSchemas.filter(function (entityClass) { return (entityClass instanceof EntitySchema) === false; });
        var entitySchemas = entityClassesOrSchemas.filter(function (entityClass) { return entityClass instanceof EntitySchema; });
        var allEntityClasses = entityClasses.concat(importClassesFromDirectories(entityDirectories));
        allEntityClasses.forEach(function (entityClass) {
            if (entityClass instanceof EntitySchema) {
                entitySchemas.push(entityClass);
                allEntityClasses.slice(allEntityClasses.indexOf(entityClass), 1);
            }
        });
        var decoratorEntityMetadatas = new EntityMetadataBuilder(this.connection, getMetadataArgsStorage()).build(allEntityClasses);
        var metadataArgsStorageFromSchema = new EntitySchemaTransformer().transform(entitySchemas);
        var schemaEntityMetadatas = new EntityMetadataBuilder(this.connection, metadataArgsStorageFromSchema).build();
        return decoratorEntityMetadatas.concat(schemaEntityMetadatas);
    };
    return ConnectionMetadataBuilder;
}());
export { ConnectionMetadataBuilder };

//# sourceMappingURL=ConnectionMetadataBuilder.js.map
