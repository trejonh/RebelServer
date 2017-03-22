#!/usr/bin/python

import smtplib, sys, json


def send_email(email_data):
	message = "From: <Furious-Monkey>nonreply@foo.com\n"+"To: "+email_data["recipients"]+"\nSubject: "+email_data["subject"]+"\n"+email_data["message"]+"\n"
	try:
	   smtpObj = smtplib.SMTP(email_data["smtp"]["server"],email_data["smtp"]["port"])
	   smtpObj.starttls()
	   smtpObj.login(email_data["username"],email_data["password"])
	   smtpObj.sendmail('nonreply@foo.com', email_data["recipientArray"], message)         
	   print "Successfully sent text"
	except SMTPException:
	   print "Error: unable to send text"
   #Read data from stdin
def read_in():
	lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
	return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
	data = read_in()
	data = json.loads(data)
    #return the sum to the output stream
	send_email(data)

#start process
if __name__ == '__main__':
	main()