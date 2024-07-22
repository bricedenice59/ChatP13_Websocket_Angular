import {ChatService} from "../services/websockets/chat-service";

// Factory function to create ChatService with the token
export function chatServiceFactory(): ChatService {
  const authToken = sessionStorage.getItem("token");
  return new ChatService(authToken);
}
