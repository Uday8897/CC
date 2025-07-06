import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cftable')

def lambda_handler(event, context):
    body = json.loads(event['body'])

    name = body['name']
    email = body['email']
    subject = body['subject']
    feedback = body['feedback']

    table.put_item(
        Item={
            'email': email,
            'name': name,
            'subject': subject,
            'feedback': feedback
        }
    )

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "https://dcc5371t1lcoo.cloudfront.net",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        'body': json.dumps({'message': 'Feedback submitted successfully'})
    }



{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
