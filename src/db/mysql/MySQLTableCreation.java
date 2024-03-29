package db.mysql;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Connection;

public class MySQLTableCreation {
	// Run this as Java application to reset db schema.
	public static void main(String[] args) {
		try {
			// Step 1 Connect to MySQL.
			System.out.println("Connecting to " + MySQLDBUtil.URL);
			//建立连接
			//1）把自己加到表里去
			Class.forName("com.mysql.cj.jdbc.Driver").getConstructor().newInstance();
			//2）用driver建立链接
			Connection conn = DriverManager.getConnection(MySQLDBUtil.URL);
			
			if (conn == null) {
				return;
			}
			
			//Step 2 Drop tables in case they exist.
			//注意有foreign key关联的table，一定要先删除指出foreign key的，再删被指向的 不然会报错
			Statement stmt = conn.createStatement();
			
			String sql = "DROP TABLE IF EXISTS categories";
			stmt.executeUpdate(sql);
			
			sql = "DROP TABLE IF EXISTS history";
			stmt.executeUpdate(sql);
			
		    sql = "DROP TABLE IF EXISTS users";
			stmt.executeUpdate(sql);

			sql = "DROP TABLE IF EXISTS items";
			stmt.executeUpdate(sql);
			
			//Step 3 Create new tables
			sql = "CREATE TABLE items (" + 
			      "item_id VARCHAR(255) NOT NULL," + 
			      "name VARCHAR(255)," + 
			      "rating FLOAT," + 
			      "address VARCHAR(255)," + 
			      "image_url VARCHAR(255)," + 
			      "url VARCHAR(255)," + 
			      "distance FLOAT," + 
			      "PRIMARY KEY(item_id)" + 
			      ")";
			stmt.executeUpdate(sql);
			
			sql = "CREATE TABLE users (" + 
				  "user_id VARCHAR(255) NOT NULL," +
				  "password VARCHAR(255) NOT NULL," + 
				  "first_name VARCHAR(255)," + 
				  "last_name VARCHAR(255)," + 
				  " PRIMARY KEY (user_id)"+ 
				  ")";
			stmt.executeUpdate(sql);
			
			sql = "CREATE TABLE categories (" + 
				  "item_id VARCHAR(255) NOT NULL," +
				  "category VARCHAR(255) NOT NULL," + 
				  "PRIMARY KEY(item_id, category)," + 
				  "FOREIGN KEY (item_id) REFERENCES items(item_id)"+ 
				  ")";
			stmt.executeUpdate(sql);
			
			sql = "CREATE TABLE history (" + 
				  "user_id VARCHAR(255) NOT NULL," +
				  "item_id VARCHAR(255) NOT NULL," + 
				  "last_favor_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
				  "PRIMARY KEY(user_id, item_id)," + 
				  "FOREIGN KEY (user_id) REFERENCES users(user_id)," + 
				  "FOREIGN KEY (item_id) REFERENCES items(item_id)" +
				  ")";
			stmt.executeUpdate(sql);
			
			sql = "INSERT INTO users VALUES ( '1111', '3229c1097c00d497a0fd282d586be050', 'John', 'Smith')";
			stmt.executeUpdate(sql);
			
			System.out.println("Import done successfully");
			
			

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
