"# FoodTruck-API"
This is Nodejs REST API.
Required nodejs to install it.
Download it using "git clone https://github.com/vtestiler/FoodTruck-API.git".
Install with "npm install".
If install on AWS ES2 ubuntu server, make sure that security group allow TCP on port 3005.
Also UFW on the ubuntu server needs to allow inbound connection on port 3005.
Use these links to troubleshoot connectivity issues:
https://askubuntu.com/questions/166068/port-seems-to-be-open-but-connection-refused
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-16-04

API is running with "pm2 start dist". If any changes needed, update files in src folder. Test with "npm run  dev".
If everything looks OK. Use "npm build dist" to deploy to Production. Then stop current production with "pm2 stop dist".
Start it again with "pm2 start dist". Verify API is working.

