import serial
import time
import socket

HOST = '192.168.254.6'
PORT = 1337
BUFFER_SIZE = 1024



def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))

    ser = serial.Serial('/dev/ttyACM0', 9600)
    ser.flushInput()
    time.sleep(5)

    while True:
        print "Waiting for data..."
        data = s.recv(BUFFER_SIZE)
        print 'Received data : ' + data

        if data == 'w':
            ser.write("0\n")
            ser.flush()
            weight = ser.readline()
            print weight
            response = str({"weight": weight})
            s.send(response)
        elif data == 'tc':
            ser.write("1\n")
            ser.flush()
            uid = ser.readline()
            print uid
            response = str({"uid": uid})
            s.send(response)
        else:
            ser.write("1\n")
            ser.flush()
            print "Waiting to scan..."
            uid = ser.readline()
            print uid,
            print "Fin..."


if __name__ == "__main__":
    main()