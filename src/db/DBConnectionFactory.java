package db;

import db.mysql.MySQLConnection;

public class DBConnectionFactory {
	// This should change based on the database/pipeline.
	private static final String DEFAULT_DB = "mysql";
	
	public static DBConnection getConnection(String db) {
		switch (db) {
		case "mysql":
//			return null; 
            return new MySQLConnection();
		case "mongodb":
			return null; //new MongoDBConnection();
		default:
			throw new IllegalArgumentException("Invalid db:" + db);
		}
	}
	
	public static DBConnection getConnection() {
		return getConnection(DEFAULT_DB);
	}

}
