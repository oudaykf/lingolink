off
echo
Starting
the
server...
start
Server
/B
cmd /c cd server && node server-fixed.js
echo
Waiting
for
server
to
start...
timeout
/t
5
echo
Starting
the
client...
cd
client
start

http://localhost:5001/health
