package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type HelloMessage struct {
	Message []byte
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// Allow all Origins ... for now ...
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleHello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, world!"))
}

func handleWebsocketHello(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	for {
		_, p, err := conn.ReadMessage()
		log.Println("received message: ", string(p))

		var msg interface{}
		err = json.Unmarshal(p, &msg)
		if err != nil {
			log.Println("error decoding message:", err)
			return
		}

		msgMap := msg.(map[string]interface{})
		msgType := msgMap["type"]
		if msgType == 0 {
			log.Println("invalid message type")
			continue
		}
		log.Println("message type: ", msgType)

		switch msgType.(float64) {
		case 1.0:
			handleHelloMessage(msgMap, conn)
		}
	}
}

func handleHelloMessage(msgMap map[string]interface{}, conn *websocket.Conn) {
	msg := HelloMessage{[]byte(msgMap["message"].(string))}
	log.Println("got a plain message: ", msg.Message)

	m := map[string]interface{}{
		"type":    1,
		"message": "Hello, client!",
	}

	b, err := json.Marshal(m)
	if err != nil {
		log.Println("error encoding client message: ", err)
		return
	}

	log.Println("client message: ", string(b))

	if err = conn.WriteMessage(websocket.TextMessage, b); err != nil {
		log.Println(err)
	}
}

func main() {

	http.HandleFunc("/hello", handleHello)
	http.HandleFunc("/helloWebsocket", handleWebsocketHello)
	log.Fatal(http.ListenAndServe(":8085", nil))

}
