package rpc;

import java.io.IOException;

//import java.io.PrintWriter;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import db.DBConnection;
import db.DBConnectionFactory;
import entity.Item;
import external.TicketMasterAPI;

/**
 * Servlet implementation class SearchItem
 */
@WebServlet("/search")
public class SearchItem extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SearchItem() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
//    http://localhost:8080/Jupiter/search?lat=37.38&lon=-122.08&term=sports
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// allow access only if session exists
		HttpSession session = request.getSession(false);
		if (session == null) {
			response.setStatus(403);
			return;
		}

		response.setContentType("application/json");
		double lat = Double.parseDouble(request.getParameter("lat"));
		double lon = Double.parseDouble(request.getParameter("lon"));
		
		String term = request.getParameter("term");  //具体event keyword
		String userId = request.getParameter("user_id");
		
		DBConnection connection = DBConnectionFactory.getConnection();
		try {
			List<Item> items = connection.searchItems(lat, lon, term);
			Set<String> favoriteItems = connection.getFavoriteItemIds(userId);
			
			JSONArray array = new JSONArray();
			for (Item item : items) {
				JSONObject obj = item.toJSONObject();
				obj.put("favorite", favoriteItems.contains(item.getItemId()));
				
				array.put(obj);
			}
			RpcHelper.writeJsonArray(response, array);

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			connection.close();
		}
		
//		TicketMasterAPI tmAPI = new TicketMasterAPI();
//		List<Item> items = tmAPI.search(lat, lon, keyword);
//		
//		JSONArray array = new JSONArray();
//		
//		try {
//			for (Item item : items) {
//				JSONObject obj = item.toJSONObject();
//				array.put(obj);
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//
//		}
//		RpcHelper.writeJsonArray(response, array);
//		
//		
		
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		
//		JSONArray array = new JSONArray();
//		try {
//			array.put(new JSONObject().put("username", "abcd"));
//			array.put(new JSONObject().put("username", "1234"));
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		RpcHelper.writeJsonArray(response, array);
//		
		
//		response.setContentType("application/json");
//		
//		PrintWriter out = response.getWriter();
//		
//		JSONArray array = new JSONArray();
//		
//		try {
//			array.put(new JSONObject().put("username", "abcd"));
//			array.put(new JSONObject().put("username", "1234"));
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		out.print(array);
		
//		if (request.getParameter("username") != null) {
//			String username = request.getParameter("username");
			
//			JSONObject obj = new JSONObject();

//			}
//			try {
//				obj.put("username", username);
//			} catch (JSONException e) {
//				e.printStackTrace();
//			}
			
			
//			out.println("<html><body>");
//			out.println("<h1>Hello " + username + "</h1>");
//			out.println("</body></html>");
//		}
		//PrintWriter out = response.getWriter();
//		out.println("<html><body>");
//		out.println("<h1>Hello World</h1>");
//		out.println("</body></html>");
		
//		out.close();
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
