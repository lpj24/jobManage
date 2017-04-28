package com.hbgj.bi.model;

import java.util.Date;

public class BiJob {
    private Integer id;

    private String jobName;

    private String jobPath;

    private String jobDoc;

    private String jobTable;

    private Integer jobType;

    private Integer renewable;

    private Date createtime;

    private Date updatetime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName == null ? null : jobName.trim();
    }

    public String getJobPath() {
        return jobPath;
    }

    public void setJobPath(String jobPath) {
        this.jobPath = jobPath == null ? null : jobPath.trim();
    }

    public String getJobDoc() {
        return jobDoc;
    }

    public void setJobDoc(String jobDoc) {
        this.jobDoc = jobDoc == null ? null : jobDoc.trim();
    }

    public String getJobTable() {
        return jobTable;
    }

    public void setJobTable(String jobTable) {
        this.jobTable = jobTable == null ? null : jobTable.trim();
    }

    public Integer getJobType() {
        return jobType;
    }

    public void setJobType(Integer jobType) {
        this.jobType = jobType;
    }

    public Integer getRenewable() {
        return renewable;
    }

    public void setRenewable(Integer renewable) {
        this.renewable = renewable;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }
}