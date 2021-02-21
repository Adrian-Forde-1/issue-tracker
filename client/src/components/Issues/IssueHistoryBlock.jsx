import React from "react";

const IssueHistoryBlock = ({
  date,
  updateType,
  updateInfo,
  updatedBy,
  projectLabels,
  index,
}) => {
  const issueUpdateTypes = {
    "STATUS UPDATE": "STATUS UPDATE",
    "DESCRIPTION UPDATE": "DESCRIPTION UPDATE",
    "NAME UPDATE": "NAME UPDATE",
    "LABEL UPDATE": "LABEL UPDATE",
  };

  const renderUpdateInfo = () => {
    if (updateType !== issueUpdateTypes["LABEL UPDATE"]) {
      if (updateInfo) return updateInfo;
      else return "-";
    } else {
      const renderLabels = () => {
        let labelList = [];
        //This is done because the list is returned as a string separated by spaced
        let updatedInfoList = updateInfo.split(" ");
        updatedInfoList.forEach((label, index) => {
          let labelInfo = projectLabels.find(
            (projectLabel) => projectLabel._id.toString() === label.toString()
          );

          if (
            labelInfo !== undefined &&
            labelInfo !== null &&
            Object.keys(labelInfo).length > 0
          ) {
            labelList.push(
              <div
                className="issue-history__update-block__updated-label"
                style={{ background: labelInfo.backgroundColor }}
                key={index}
              >
                <span style={{ color: labelInfo.fontColor }}>
                  {labelInfo.name}
                </span>
              </div>
            );
          }
        });

        return labelList;
      };

      return (
        <div className="issue-history__update-block__updated-labels-container">
          {renderLabels()}
        </div>
      );
    }
  };

  return (
    <div className="issue-history__update-block" key={index}>
      <h6 className="issue-history__update-block__update-type">
        {updateType ? updateType : "-"}
      </h6>
      <div className="issue-history__update-block__update-info">
        {updateType === issueUpdateTypes["STATUS UPDATE"]
          ? "Status was changed to: "
          : updateType === issueUpdateTypes["NAME UPDATE"]
          ? "Name was changed to: "
          : updateType === issueUpdateTypes["DESCRIPTION UPDATE"]
          ? "Description was changed to: "
          : "Labels were changed to: "}
        <div className="issue-history__update-block__update-info-desc">
          {renderUpdateInfo()}
        </div>
      </div>
      <div className="issue-history__update-block__updater-info">
        <span className="issue-history__update-block__updated-by">
          {updatedBy ? updatedBy : "-"} &nbsp;
        </span>{" "}
        <span>updated on</span>{" "}
        <span className="issue-history__update-block__date">
          &nbsp;
          {date
            ? new Date(date).toString().split(" ").slice(0, 4).join(" ")
            : "-"}
        </span>
      </div>
    </div>
  );
};

export default IssueHistoryBlock;
