import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import { ExpoDriver } from "./ExpoDriver";
/**
 * Runs queries on a single sqlite database connection.
 */
export declare class ExpoQueryRunner extends AbstractSqliteQueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: ExpoDriver;
    /**
     * Database transaction object
     */
    private transaction?;
    constructor(driver: ExpoDriver);
    /**
     * Starts transaction.
     */
    startTransaction(): Promise<void>;
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
}
