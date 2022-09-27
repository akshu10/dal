import S3, {
  ManagedUpload,
  GetObjectRequest,
  DeleteObjectRequest,
} from "aws-sdk/clients/s3";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: "",
  secretAccessKey: "",
  sessionToken: "",
});
const fileName = "a2.txt";
const bucketName = "a2-bucket-dall";

class FileService {
  storeObject = async (fileData: string): Promise<ManagedUpload.SendData> => {
    try {
      if (fileData === null || fileData === undefined) {
        throw new Error("FileData is null or undefined");
      }

      const storeResponse: ManagedUpload.SendData = await s3
        .upload({
          Bucket: bucketName,
          ContentType: "text/plain",
          Key: fileName,
          Body: fileData,
          ACL: "public-read",
        })
        .promise();

      return storeResponse;
    } catch (error) {
      throw error;
    }
  };

  appendObject = async (fileData: string): Promise<ManagedUpload.SendData> => {
    try {
      const objectParams: GetObjectRequest = {
        Bucket: bucketName,
        Key: fileName,
      };

      const appendResponse = await s3.getObject(objectParams).promise();

      const buffer = appendResponse.Body;
      const text = buffer?.toString();
      const newString = `${text}${fileData}`;

      const appendDataResponse = await this.storeObject(newString);

      return appendDataResponse;
    } catch (error) {
      throw error;
    }
  };

  deleteObject = async (objectUri: string): Promise<boolean> => {
    try {
      const deleteParams: DeleteObjectRequest = {
        Bucket: bucketName,
        Key: fileName,
      };

      await s3.deleteObject(deleteParams).promise();

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new FileService();
