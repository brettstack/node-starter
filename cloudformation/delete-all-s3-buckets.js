var AWS = require('aws-sdk');

var s3 = new AWS.S3();


var s3Helper = {
  deleteObject: function(client, deleteParams) {
    client.deleteObject(deleteParams, function(err, data) {
      if (err) {
        console.log("delete err " + deleteParams.Key);
      } else {
        console.log("deleted " + deleteParams.Key);
      }
    });
  },

  listBuckets: function(client) {
    client.listBuckets({}, function(err, data) {
      var buckets = data.Buckets;
      var owners = data.Owner;
      for (var i = 0; i < buckets.length; i += 1) {
        var bucket = buckets[i];
        console.log(bucket.Name + " created on " + bucket.CreationDate);
      }
      for (var i = 0; i < owners.length; i += 1) {
        console.log(owners[i].ID + " " + owners[i].DisplayName);
      }
    });

  },

  deleteBucket: function(client, bucket) {
    client.deleteBucket({
      Bucket: bucket
    }, function(err, data) {
      if (err) {
        console.log("error deleting bucket " + err);
      } else {
        console.log("delete the bucket " + data);
      }
    });
  },

  emptyBucket: function(client, bucket) {
    var self = this;
    client.listObjects({
      Bucket: bucket
    }, function(err, data) {
      if (err) {
        console.log("error listing bucket objects " + err);
        return;
      }
      var items = data.Contents;
      for (var i = 0; i < items.length; i += 1) {
        var deleteParams = {
          Bucket: bucket,
          Key: items[i].Key
        };
        self.deleteObject(client, deleteParams);
      }
    });
  },

  emptyAllBuckets: function(client) {
    client.listBuckets({}, function(err, data) {
      var buckets = data.Buckets;
      
      for (var i = 0; i < buckets.length; i += 1) {
        s3Helper.emptyBucket(client, buckets[i].Name);
      }
    });
  },

  deleteAllBuckets: function(client) {
    client.listBuckets({}, function(err, data) {
      var buckets = data.Buckets;
      
      for (var i = 0; i < buckets.length; i += 1) {
        s3Helper.deleteBucket(client, buckets[i].Name);
      }
    });
  }
};

s3Helper.emptyAllBuckets(s3);
s3Helper.deleteAllBuckets(s3);