import boto3
from botocore.client import Config
import StringIO
import zipfile
import mimetypes

def lambda_handler(event, context):

    # default values if not not called by pipeline
    location = {
        "bucketName": 'portfoliobuild.pragmaticbitbucket.com',
        # file name
        "objectKey": 'portfolioBuild.zip'
    }
    
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:us-east-1:538911721305:deployPortfolioTopic')
    
    try:
        job = event.get("CodePipeline.job")
        # if the function was not invoked by pipeline, this wont be there
        if job:
            # http://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
            for artifact in job["data"]["inputArtifacts"]:
                if artifact["name"] == "MyAooBuild":
                    location = artifact["location"]["s3Location"]
        
        print "Building portfolio from " + str(location)
        
        s3 = boto3.resource('s3', config = Config(signature_version='s3v4'))

        portfolio_bucket = s3.Bucket('portfolio.pragmaticbitbucket.com')
        build_bucket = s3.Bucket(location["bucketName"]);

        # download zip file into the stream
        portfolio_zip = StringIO.StringIO()
        build_bucket.download_fileobj(location["objectKey"], portfolio_zip)

        # and upload each file in the zip into the bucket
        with zipfile.ZipFile(portfolio_zip) as myzip:
            for nm in myzip.namelist():
                obj = myzip.open(nm)
                portfolio_bucket.upload_fileobj(obj, nm, ExtraArgs={'ContentType':mimetypes.guess_type(nm)[0]})
                # make the uploaded file public readable
                portfolio_bucket.Object(nm).Acl().put(ACL='public-read')
            
        print "Portfolio job done!"
        topic.publish(Subject="Portfolio Deployed", Message="Portfolio app deployed successfully. Weeee!!!")
        # need to tell pipeline it was a success -- it doesnt know on its own
        if job:
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_success_result(jobId = job["id"])
    except:
        topic.publish(Subject="Portfolio Deploy Failed", Message="Portfolio app was not deployed successfully!!!")
        raise
        
    return "Hello from Lambda"
