import boto3
from botocore.client import Config
import StringIO
import zipfile
import mimetypes

def lambda_handler(event, context):

    s3 = boto3.resource('s3', config = Config(signature_version='s3v4'))

    portfolio_bucket = s3.Bucket('portfolio.pragmaticbitbucket.com')
    build_bucket = s3.Bucket('portfoliobuild.pragmaticbitbucket.com')

    # download zip file into the stream
    portfolio_zip = StringIO.StringIO()
    build_bucket.download_fileobj('portfolioBuild.zip', portfolio_zip)

    # and upload each file in the zip into the bucket
    with zipfile.ZipFile(portfolio_zip) as myzip:
        for nm in myzip.namelist():
            obj = myzip.open(nm)
            portfolio_bucket.upload_fileobj(obj, nm, ExtraArgs={'ContentType':mimetypes.guess_type(nm)[0]})
            # make the uploaded file public readable
            portfolio_bucket.Object(nm).Acl().put(ACL='public-read')
            
    print "Portfolio job done!"
    return "Hello from Lambda"
