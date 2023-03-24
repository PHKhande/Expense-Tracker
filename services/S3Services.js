const AWS = require('aws-sdk');

exports.uploadtoS3 = async (data, fileName) => {

    // require('dotenv').config(); 
  
    const BUCKET_NAME = 'expensetrackerfiles';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET_KEY = process.env.IAM_USER_SECRET_KEY;
  
    console.log(IAM_USER_KEY, IAM_USER_SECRET_KEY)
  
    const s3bucket = new AWS.S3( {
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET_KEY
    })
  
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: 'public-read'
    }
  
    return new Promise( (resolve, reject) => {
  
      s3bucket.upload(params, (err, s3response) => {
        if(err){
          console.log('Something went wrong', err);
          reject(err);
        } else {
          console.log('Success', s3response);
          resolve(s3response.Location);
        }
    
      })
  
    })
  
  }
  
  