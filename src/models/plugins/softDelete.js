/* eslint-disable no-param-reassign */
const softDelete = (schema) => {
    schema.add({
      deleted: { type: Boolean, default: false },
      deletedAt: { type: Date, default: null },
    });
  
    /**
     * Soft delete a document
     */
    schema.methods.softDelete = async function () {
      this.deleted = true;
      this.deletedAt = new Date();
      return this.save();
    };
  
    /**
     * Restore a soft-deleted document
     */
    schema.methods.restore = async function () {
      this.deleted = false;
      this.deletedAt = null;
      return this.save();
    };
  
    /**
     * Override find queries to exclude soft-deleted documents by default
     */
    schema.pre(/^find/, function (next) {
      if (!this.getFilter().includeDeleted) {
        this.where({ deleted: false });
      }
      next();
    });
  
    /**
     * Static method to get soft-deleted documents
     */
    schema.statics.findDeleted = function () {
      return this.find({ deleted: true });
    };
  };
  
  module.exports = softDelete;  