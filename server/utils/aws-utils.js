// aws-utils.js

import AWS from 'aws-sdk';

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

AWS.config.update({ region: AWS_REGION, accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });

const s3 = new AWS.S3();
const iam = new AWS.IAM();

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME; // Replace with your S3 bucket name
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID; // Replace with your AWS account ID

const createS3UserFolder = async (userId) => {
    try {
        const userFolderKey = `${userId}/`;

        // Create a new S3 user folder with private access
        await s3.putObject({
            Bucket: AWS_BUCKET_NAME,
            Key: userFolderKey,
            ACL: 'private',
        }).promise();


        await createIAMUser(userId, userFolderKey);
        // Create IAM policy to allow the user to access their folder only
        // await createIAMPolicy(userId, userFolderKey);

        // // Attach the policy to the user
        // await attachPolicyToUser(userId);
    } catch (error) {
        console.error('Error creating S3 user folder:', error);
        throw error;
    }
};

const createIAMUser = async (userId, userFolderKey) => {
    try {
        // Create IAM user
        const createUserResponse = await iam.createUser({
            UserName: `user_${userId}`, // Customize the IAM username format
        }).promise();

        const iamUserId = createUserResponse.User.UserId; // Extract IAM user ID
        console.log('iamUserId', iamUserId);
        // Create IAM policy for the user
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Action: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
                    Resource: [
                        `arn:aws:s3:::${AWS_BUCKET_NAME}/${userFolderKey}*`,
                        `arn:aws:s3:::${AWS_BUCKET_NAME}`,
                    ],
                },
            ],
        };

        // Attach the policy to the user
        await iam.putUserPolicy({
            PolicyDocument: JSON.stringify(policyDocument),
            PolicyName: `${userId}-S3-Access-Policy`,
            UserName: `user_${userId}`,
        }).promise();

        console.log(`IAM user created for user ${userId}`);
    } catch (error) {
        console.error('Error creating IAM user:', error);
        throw error;
    }
};

const addIAMPolicyForCollaborator = async (ownerId, collaboratorId, collaboratorFolderKey) => {
    try {
        // Construct the policy for the collaborator
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Action: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
                    Resource: [
                        `arn:aws:s3:::${AWS_BUCKET_NAME}/${collaboratorFolderKey}*`,
                        `arn:aws:s3:::${AWS_BUCKET_NAME}/${collaboratorFolderKey}`,
                    ],
                },
            ],
        };

        // Attach the policy to the collaborator's IAM user
        await iam.putUserPolicy({
            PolicyDocument: JSON.stringify(policy),
            PolicyName: `MemoryBoxCollaboratorPolicy_${ownerId}_${collaboratorId}`,
            UserName: `user_${collaboratorId}`,
        }).promise();

        // Optionally, you might want to notify the owner that a collaborator was added
        // You can use SNS or other mechanisms for notifications

    } catch (error) {
        console.error('Error updating IAM policy for collaborator:', error);
        throw error;
    }
};

const removeIAMAccessForCollaborator = async (ownerId, collaboratorId) => {
    try {
        // Remove the IAM policy for the collaborator
        await iam.deleteUserPolicy({
            UserName: `user_${collaboratorId}`,
            PolicyName: `MemoryBoxCollaboratorPolicy_${ownerId}_${collaboratorId}`,
        }).promise();

        // Optionally, you might want to notify the owner that a collaborator was removed
        // You can use SNS or other mechanisms for notifications

    } catch (error) {
        console.error('Error removing IAM access for collaborator:', error);
        throw error;
    }
};

const createS3Folder = async (folderKey) => {
    try {
        // Use the AWS SDK to create a placeholder object with no content to represent the folder
        await s3.putObject({
            Bucket: AWS_BUCKET_NAME,
            Key: `${folderKey}`,  // Note the trailing slash to represent a "folder"
            Body: '',  // Empty content
        }).promise();
    } catch (error) {
        console.error('Error creating S3 folder:', error);
        throw error;
    }
}

const deleteS3Folder = async (folderKey) => {
    try {
        // Use the AWS SDK to delete all objects within the folder
        const objectsInFolder = await s3.listObjectsV2({ Bucket: AWS_BUCKET_NAME, Prefix: folderKey }).promise();
        if (objectsInFolder.Contents.length > 0) {
            const deleteObjects = objectsInFolder.Contents.map(obj => ({ Key: obj.Key }));
            await s3.deleteObjects({ Bucket: AWS_BUCKET_NAME, Delete: { Objects: deleteObjects } }).promise();
        }

        // Delete the placeholder object representing the folder itself
        await s3.deleteObject({ Bucket: AWS_BUCKET_NAME, Key: folderKey }).promise();
    } catch (error) {
        console.error('Error deleting S3 folder:', error);
        throw error;
    }
};

export { createS3UserFolder, addIAMPolicyForCollaborator, removeIAMAccessForCollaborator, createIAMUser, createS3Folder, deleteS3Folder };
