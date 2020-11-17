declare enum PropertyType {
  Literal = 'literal',
  Number = 'number',
  Date = 'date',
  HoursAndMinutes = 'hoursandminutes',
  Boolean = 'boolean',
  String = 'string',
  FilePath = 'filepath',
  FolderPath = 'folderpath',
  FileType = 'filetype',
  FolderPattern = 'folderpattern',
  Regex = 'regex',
  OAuthToken = 'oauthtoken'
}

declare enum LogLevel {
  Info = 'info',
  Warning = 'warning',
  Error = 'error'
}

declare enum DatasetModel {
  Opaque = 'Opaque',
  XML = 'XML',
  XMP = 'XMP',
  JDF = 'JDF'
}

declare enum AccessLevel {
  ReadOnly = 'readOnly',
  ReadWrite = 'readWrite'
}

declare enum Scope {
  FlowElement = 'flowElement',
  Element = 'element',
  Global = 'global'
}

/**
 * An instance of the `Connection` class represents an outgoing connection of the flow element associated with the script.
 * Connection objects can be obtained through functions of the `FlowElement` class.
 * @class
 */
declare class Connection {
  /**

   * @description
   * The element ID of a particular flow element offers the following fundamental guarantees:
   *- It differs from the element ID of any other flow element in any currently active flow.
   *- It remains unchanged as long as the flow in which it resides is not edited, even if the flow is deactivated and reactivated and across Switch sessions.
   *- The element ID of a connection is never equal to the element ID of a non-connection flow element.
   *
   * Note that holding or releasing connections or renaming the flow does not count as editing in this context.
   * However, exporting and re-importing (or upgrading) a flow, or renaming a flow element inside the flow, does count as editing.
   * @returns {string} a string that uniquely identifies the connection (within the limits of the guarantees described below).
   * Callers should not rely on the syntax of the returned string as this may change between Switch versions.
   */
  getId(): string;

  /**
   * @description Returns the name of the connection as displayed in the canvas; this may be an empty string.
   * @returns {string} the name of the connection as displayed in the canvas; this may be an empty string.
   */
  getName(): string;

  /**
   * Returns the value of a custom outgoing connection property as string.
   * The property for which to return the value is specified by its property tag.
   * @param {string} tag - the tag for which the property value is requested
   * @returns the value of a custom outgoing connection property as string.
   * @see {FlowElement.getPropertyStringValue}
   */
  getPropertyStringValue(tag: string): Promise<string | string[]>;

  /**
   * Gets the connection property value type.
   * @param {string} tag - the tag for which the property type is requested
   * @returns {PropertyType} property type
   * @see See the {@link PropertyType} enumeration for the possible return values.
   */
  getPropertyType(tag: string): PropertyType;

  /**
   * Returns the name of the property as visible in the user interface. (However, this is an untranslated name.)
   * This method is mostly intended to include the property name in a log message.
   * @param {string} tag - property tag
   * @returns {string} the name of the property as visible in the user interface.
   */
  getPropertyDisplayName(tag: string): string;

  /**
   * @returns {boolean} `true` if a property with the specified tag is available for the connection, otherwise returns `false`.
   * @param {string} tag - property tag
   */
  hasProperty(tag: string): boolean;
}

declare namespace Connection {
  /**
   * Connection.Level is a static field of the Connection instance that represents the traffic light level of the connection.
   * It is also available in global scope as EnfocusSwitch.Connection.Level if you need to use it outside of main.js (or .ts).
   * It's used to easily provide one of the following supported levels:
   * - Connection.Level.Error
   * - Connection.Level.Warning
   * - Connection.Level.Success.
   */
  enum Level {
    Success = 'success',
    Warning = 'warning',
    Error = 'error'
  }
}

/**
 * The single instance of the FlowElement class is passed as an argument to the script entry points
 * that operate in the context of a particular flow element.
 * @class
 */
declare class FlowElement {
  /**
   * Returns the value of a custom script property as string. The property for which to return the value is specified by its property tag.
   * In case of an `OAuthToken` property type, the function resolves with a valid OAuth2 token. It is refreshed automatically if needed.
   * The function throws an `"invalid tag"` error, if the property with the given tag:
   * - is not defined in the script declaration OR
   * - is a dependent property which is not visible for the current value of the parent property.
   * @param {string} tag - property tag
   * @return {Promise<string | string[]>} - value(s) of a custom script property as string.
   * @throws an `"invalid tag"` error (for more details, see the description)
   * @see {@link PropertyType}
   */
  getPropertyStringValue(tag: string): Promise<string | string[]>;

  /**
   * Returns the property value type. In case a property value can be entered via different editors, the property value type is required to correctly interpret the property value. The function throws an error if the property with the given tag
   * - is not defined in the script declaration OR
   * - is a dependent property, which is not visible for the current value of the parent property.
   * @param {string} tag - property tag
   * @return {PropertyType} - the property value type
   */
  getPropertyType(tag: string): PropertyType;

  /**
   * Returns the untranslated name of the property as visible in the user interface in English.
   * This method is mostly intended to include the property name in a log message.
   * @param {string} tag - property tag
   * @returns {string} the untranslated name of the property as visible in the user interface in English
   */
  getPropertyDisplayName(tag: string): string;

  /**
   * Returns true if a property with the specified tag is available for the flow element, otherwise returns false.
   * @param {string} tag - property tag
   * @returns {boolean} - `true` if a property with the specified tag is available for the flow element, otherwise `false`
   */
  hasProperty(tag: string): boolean;

  /**
   * Returns a list of Connection instances representing the outgoing connections of the flow element associated with this script.
   * The list is in arbitrary order. If there are no outgoing connections, the list is empty.
   * @returns {Connection[]}  a list of Connection instances representing the outgoing connections of the flow element
   */
  getOutConnections(): Connection[];

  /**
   * Sets the interval, in seconds, between subsequent invocations of the `timerFired` entry point (if it has been declared in the script).
   * The implementation guarantees only that the time between invocations will not be less than the specified number of seconds.
   * Depending on run-time circumstances the actual interval may be (much) longer.
   * The default value for the timer interval is 300 seconds (5 minutes).
   * @param {number} seconds - interval between invocations of `timerFired`. Default is 300 seconds.
   */
  setTimerInterval(seconds: number): void;

  /**
   * Logs a message of the specified level for this flow element.
   * Returned promise is resolved when the message is successfully logged, otherwise throws an error.
   * @param {LogLevel} level - level of the message.
   * @param {string} message - the message to be logged
   * @param {Array} messageParams - message parameters that are used to substitute (see example)
   * @example
   *  async function() {
   *    try {
   *      await flowElement.log(LogLevel.Warning, 'You are reaching the limits: %1 of %2 attempts remaining.', ['only 1', 10]);
   *    } catch (error) {
   *      // do something in case of an error
   *    }
   *  }
   */
  log(level: LogLevel, message: string, messageParams?: (string | number | boolean)[]): Promise<void>;

  /**
   * Logs a fatal error for this flow element with the specified message
   * and puts the element instance in the "problem process" state. `messageParam` is used as a substitute for `%1` in the message.
   * @param {string} message - the message to be logged
   * @param {string} messageParam - the value to be used as substitute
   */
  failProcess(message: string, messageParam: string): void;

  /**
   * For scripted plug-ins, returns the location of the script resources folder.
   * Throws an exception if called for Switch scripts.
   * @returns the location of the script resources folder (ONLY for scripted plug-ins).
   * @throws `Error` if called for Switch scripts
   */
  getPluginResourcesPath(): string;

  /**
   * Creates a new job from a file or folder that already exists at the specified path. Returns a job instance
   * representing a new job with default values that does not correspond to an incoming job.
   * It should be separately routed using sendTo methods.<br/>
   * If the new job should inherit the job properties of the input job, then use the method {@link Job.createChild} instead. <br/>
   * <b>Note:</b> This method is valid only in `jobArrived` and `timerFired` entry points.<br/>
   * <b>Note:</b> The file or folder that was passed to createJob will not automatically be removed by Switch when sending or failing the job.
   * Therefore it's up to the script to make sure that temporary files or folders passed to createJob are correctly removed
   * after sending or failing the job.
   * @param {string} path - the path to the file or folder
   * @return {Promise<Job>} a promise containing the new job
   * @example
   * async function timerFired(s, flowElement) {
   *  try {
   *    const newJob...;
   *    await newJob.sendToSingle();
   *  } catch(e) {
   *    //catch the error
   *  }
   *    //remove ...
   * }
   */
  createJob(path: string): Promise<Job>;
}

/**
 * An instance of the Job class represents a job (file or job folder) waiting to be processed in one of the input folders
 * for the flow element associated with the script. The third argument passed to the jobArrived entry point is the newly arrived job that
 * triggered the entry point's invocation.
 *
 * New job objects can be created using the createJob function of the {@link FlowElement} class.
 *
 * Processing a job in a script usually consists of the following steps:
 * - Decide on how to process the job based on file type etc.
 * - Get the path to the incoming job using the {@link Job.get}() call with the appropriate access level.
 * - Generate a temporary path for one or more output files or folders.
 * - Create the output(s) in the temporary location.
 * - Create the output job(s) using the {@link Job.createChild}() call.
 * - In addition to (or instead of) creating new jobs it is possible to modify the incoming job.
 * - Call one of the sendTo functions for each output.
 *
 * If the incoming job is passed along without change, the `Job.sendTo...()` functions can be called
 * directly on the incoming job object, skipping all intermediate steps.
 *
 * A job remains in the input folder until one of the `Job.sendTo()` or `Job.fail()` functions has been called for the job.
 * The jobArrived entry point will be invoked only once for each job, so if the entry point does not call a `sendTo()` or `fail()` function
 * for the job, the script should do so at a later time (in a timerFired entry point or in a subsequent invocation of the `jobArrived`
 * entry point for a  different job).
 *
 * <b>Note:</b>  After the flow restarts, the `jobArrived` entry point will be invoked once again for all jobs in the input folder.
 */
declare class Job {
  /**
   * Returns the file or folder name for the job, but excluding the unique filename prefix (job ID).
   * By default, the returned name includes the file extension. The user can exclude the file extension
   * by setting the includeExtension argument to false.
   * @param {boolean} [includeExtension=true] - `true` if the name should include the extension, otherwise `false`.
   * @returns {string} the file or folder name for the job (with or without extension)
   */
  getName(includeExtension?: boolean): string;

  /**
   * Returns the unique job ID. This is a filename prefix used for the job, without the underscores.
   * For example, for a job named "_0G63D_my_job.txt", this function would return "0G63D". <br/>
   * Callers should not rely on the syntax of the returned string as this may change between Switch versions.
   * @return {string} - the unique job ID.
   */
  getId(): string;

  /**
   * Returns `true` if the job is a single file, `false` otherwise.
   */
  isFile(): boolean;

  /**
   * Returns `true` if the job is a folder, `false` otherwise.
   */
  isFolder(): boolean;

  /**
   * Marks the job as completed without generating any output.
   */
  sendToNull(): Promise<void>;

  /**
   * Sends the job to the single outgoing move connection. The optional argument `newName` allows renaming the job.
   * @param {string} [newName] - new name for the job (optional)
   * @example
   * await job.sendToSingle('newName.pdf');
   * await job.sendToSingle();
   */
  sendToSingle(newName?: string): Promise<void>;

  /**
   * Sends the job to the specified outgoing connection, regardless of the connection type.<br>
   * The optional argument `newName` allows renaming the job.
   * @param {Connection} connection - the specified outgoing connection
   * @param {string} [newName] - new name for the job (optional)
   * @example
   * const outConnections = flowElement.getOutConnections();
   * for (const connection of outConnections) {
   *   if (job.isFile() && connection.getName() === 'move') {
   *     await job.sendTo(connection, "sendTo.txt"); // here it is
   *   }
   * }
   */
  sendTo(connection: Connection, newName?: string): Promise<void>;

  /**
   * Sends the jobs to the outgoing "data" traffic light connections that have the specified connection level property enabled.
   * The optional argument `newName` allows renaming the job.<br/>
   *
   * If the script is not configured to use traffic light connections, this function logs an error and does nothing.<br/>
   * If the flow element has no outgoing connections of the specified level, the job is failed with an appropriate error message.
   * @param {Connection.Level} level - the specified connection level
   * @param {string} [newName] - new name for the job (optional)
   * @example
   * await job.sendToData(Connection.Level.Warning, 'data_warning.txt');
   * await job.sendToData(Connection.Level.Success, 'data_success.txt');
   */
  sendToData(level: Connection.Level, newName?: string): Promise<void>;

  /**
   * Sends the job to the outgoing "log" traffic light connections that have the specified connection level property enabled.
   * The optional argument `newName` allows renaming the job.
   *
   * For "data with log" traffic light connections, the job is attached as a metadata dataset to all "data" jobs,
   * that is jobs routed via {@link Job.sendToData}. The `model` argument defines the metadata dataset model
   * and the metadata dataset name is taken from the "Dataset name" property of the outgoing connections.
   *
   * Note that metadata datasets have automatically generated names and defined extensions.
   * Therefore after the job is attached as a metadata dataset, its name is lost but the filename extension is preserved.
   * If the `newName` argument is defined, the extension of newName will be used for the attached metadata datasets.
   *
   * If the script is not configured to use traffic light connections, this function logs an error and does nothing.
   *
   * If the flow element has no outgoing connections of the specified level, the job is discarded.
   *
   * For possible values of the model argument, see [DatasetModel](DatasetModel).
   * If the model argument has an unsupported value, an exception is thrown.
   * @param {Connection.Level} level - the specified connection level
   * @param {string} [newName] - new name for the job (optional)
   * @param {DatasetModel} model - dataset model
   * @throws an exception if the model argument has an unsupported value
   * @example
   * await job.sendToLog(Connection.Level.Error, DatasetModel.XML, 'log_error.xml');
   * await job.sendToLog(Connection.Level.Warning, DatasetModel.XML, 'log_warning.xml');
   * await job.sendToLog(Connection.Level.Success, DatasetModel.XML, 'log_success.xml');
   */
  sendToLog(level: Connection.Level, model: DatasetModel, newName?: string): Promise<void>;

  /**
   * Logs a fatal error for the job with the specified message and moves the job to the Problem jobs folder.
   * `messageParams` are used as substitutes for `%1`, `%2` etc. in the message.
   * Note that newly created jobs are not moved to the Problem jobs folder
   * (i.e. a job created using `createChild()` or `createJob()` and failed during the same entry point invocation is not moved).
   *
   * If the message string contains references to non-existing message parameters, an error is thrown. See {@link Job.log}.
   * @param {string} message - the specified message to log alongside with job failing
   * @param {(string | number | boolean)[]} messageParams - substitutes for `%1`, `%2` etc. in the message
   * @throws an error if the message string contains references to non-existing message parameters
   * @example
   * job.fail('Something went wrong with the job %1', [job.getName()])
   */
  fail(message: string, messageParams: (string | number | boolean)[]): void;

  /**
   * Logs a message of the specified level for this job, automatically including the appropriate job information.
   *
   * If the message string contains references to non-existing message parameters, an error is thrown.
   * If you want to log a message that contains '%' , pass it in the message parameters:
   *
   * `await job.log(LogLevel.Info, '%1', [message]);`
   * @param {LogLevel} level - the specified level for the log message
   * @param {string} message - the message itself
   * @param {(string | number | boolean)[]} messageParams - substitutes for `%1`, `%2` etc. in the message
   * @throws an error if the message string contains references to non-existing message parameters
   * @example
   * async function() {
   *  try {
   *    await job.log(LogLevel.Warning, 'Something takes longer for job %1 with name "%2"', [job.getId(), job.getName()])
   *  } catch (error) {
   *    // do something in case of an error
   *  }
   * }
   */
  log(level: LogLevel, message: string, messageParams?: (string | number | boolean)[]): Promise<void>;

  /**
   * Returns the value of the private data with the specified tag, or an empty string if no private data with that tag was set for the job.
   * @param {string} tag - tag for which to get private data
   * @returns the value of the private data with the specified tag, or an empty string if no private data with that tag was set for the job.
   */
  getPrivateData(tag: string): Promise<string>;
  /**
   * Returns:
   * - If tags are provided, a list of objects in the format defined above. The result will contain only data for the provided tags.
   * If non-existing tags are provided, the result will not contain the data for these tags.
   * - If tags are not provided, a list of objects in the format defined above (`{ tag: string, value: string }`).
   * The result will contain all available private data for the job.
   * @see examples in {@link Job.setPrivateData}.
   * @param {string} [tags] - tag for which to get private data (optional)
   */
  getPrivateData(tags?: string[]): Promise<{ tag: string, value: string }[]>;

  /**
   * Sets the value of the private data with the specified tag to the specified string.
   * If private data with the same tag name exists, the value of the private data will be replaced with the new one.
   * <b>Note:</b>  Throws an error if no arguments are provided, or if the `value` argument is missing.
   * @param {string} tag - the requested tag
   * @param {string} value - the value to set
   * @throws an error if no arguments are provided, or if the `value` argument is missing.
   */
  setPrivateData(tag: string, value: string): Promise<void>;
  /**
   * Sets the private data values for the specified tags. If private data with the same tag name exists, the value of the private data
   * will be replaced with the new one.
   * <b>Note:</b> Throws an error if no data is specified or if `privateData` is not an array.
   * @param {{ tag: string, value: string }[]} privateData - data to set
   * @example
   * // Example for getPrivateData and setPrivateData
   * const expectedPrivateData = [
   *  { tag: 'tag1', value: 'value1' },
   *  { tag: 'tag2', value: 'value2' },
   *  { tag: 'tag3', value: 'value3' },
   * ];
   * try {
   *  await job.setPrivateData('tag4', 'value4');
   *  await job.setPrivateData(expectedPrivateData);
   *  let actual = await job.getPrivateData();
   *  console.log('get all private data:', actual);
   *  actual = await job.getPrivateData('tag1');
   *  console.log('get one existing:', actual);
   *  actual = await job.getPrivateData('nonExisting');
   *  console.log('get one non-existing:', actual);
   *  actual = await job.getPrivateData(['tag2', 'tag3']);
   *  console.log('get specific:', actual);
   *  await job.sendToSingle();
   * } catch (e) {
   *  console.log(e);
   *  job.fail(`${job.getName()} : ${e.message}`, []);
   * }
   *
   * /* Output:
   * get all private data: [
   *  { tag: 'BeingProcessedByRemoteProcessElement_7.2', value:'1' },{ tag: 'tag4', value: 'value4' },
   *  { tag: 'tag1', value: 'value1' },
   *  { tag: 'tag2', value: 'value2' },
   *  { tag: 'tag3', value: 'value3' }
   * ]
   * get one existing: value1
   * get one non-existing:
   * get specific: [ { tag: 'tag2', value: 'value2' }, { tag: 'tag3', value: 'value3' } ]
   * --- End of output
   */
  setPrivateData(privateData: { tag: string, value: string }[]): Promise<void>;

  /**
   * Removes private data with the specified tag from the job.
   * @param {string} tag - tag for which private data should be removed
   * @throws an error if no tag is specified
   */
  removePrivateData(tag: string): Promise<void>;
  /**
   * Removes private data with the specified tags from the job.
   * @param {string[]} tags - tags for which private data should be removed
   * @throws throws an error if the `tags` are not specified, or if the array is empty.
   * @example
   * try {
   *  await job.setPrivateData([
   *    { tag: 'survived1', value: 'value_survived1' },
   *    { tag: 'survived2', value: 'value_survived2' },
   *    { tag: 'toBeRemoved1', value: 'value_removed1' },
   *    { tag: 'toBeRemoved2', value: 'value_removed2' },
   *    { tag: 'toBeRemoved3', value: 'value_removed3' },
   *  ]);
   *  await job.removePrivateData('toBeRemoved1');
   *  await job.removePrivateData(['toBeRemoved2', 'toBeRemoved3']);
   *  await job.sendToSingle();
   * } catch (e) {
   *  console.log(e);
   *  job.fail(`${job.getName()} : ${e.message}`, []);
   * }
   */
  removePrivateData(tags: string[]): Promise<void>;

  /**
   * Returns the path to the job on the file system. It allows the user to read file/folder contents (if called with `AccessLevel.ReadOnly`)
   * and/or to manipulate it (if called with `AccessLevel.ReadWrite`).
   * Any file/folder modification will be detected and uploaded automatically on the routing stage (see <u>Routing a job</u> in the scripting documentation)
   *
   * <b>Note:</b> If job content modification is detected:
   * - If called with `AccessLevel.ReadOnly`, an error is thrown.
   * - If called with `AccessLevel.ReadWrite`, the job content is updated with the modified content.
   *
   * The above applies to `Job::sendToSingle`, `Job::sendTo`, `Job::sendToLog` and `Job::sendToData`.
   * @param {AccessLevel} accessLevel - an access level to get the path to the job (ReadOnly or ReadWrite)
   * @throws an error if unknown `AccessLevel` is provided OR any error that occurs when job content is transferred/accessed
   * @example
   * // Example 1:
   * const fs = require("fs-extra");
   * async function jobArrived(s, flowElement, job) {
   *  // READ-WRITE example
   *  const tempPath = await job.get(AccessLevel.ReadWrite);
   *  if (job.isFile()) {
   *   await fs.copy(sourceFile, tempPath); // i.e. replace job file with another file
   *  } else {
   *   // i.e. replace with your own folder structure
   *   await fs.emptyDir(tempPath);
   *   await fs.copy(sourceFolder, tempPath);
   *  }
   *  await job.sendToSingle(); //at this stage, new job content will be uploaded automatically;
   * }
   * // Example 2:
   * const fs = require("fs-extra");
   * async function jobArrived(s, flowElement, job) {
   *  // READ-ONLY example
   *  const jobPath = await job.get(AccessLevel.ReadOnly);
   *  if (job.isFile()) {
   *    const content = await fs.readFile(jobPath, { encoding: "utf8" }); // i.e. read file content;
   *    await job.log(LogLevel.Info, "Job content is: " + content);
   *  } else {
   *    const folderStructure = await fs.readdir(jobPath); //i.e. read folder structure
   *    await job.log(LogLevel.Info, "Job content structure is: " + folderStructure);
   *  }
   *  await job.sendToSingle();
   * }
   */
  get(accessLevel: AccessLevel): Promise<string>;

  /**
   * Creates a child job from a file or folder that already exists at the specified path. Returns a job instance representing a new job
   * that inherits the processing history, external metadata and private data from the 'parent' job.
   * It should be separately routed using one of the `sendTo` methods.
   *
   * If the new job should not inherit the properties of the input job, or if there is no input job as is usually the case inside the
   * `timerFired` entry point, then use {@link FlowElement.createJob}.
   *
   * <b>Note:</b>  The file or folder that was passed to createChild will not automatically be removed by Switch when sending or failing the job.
   * Therefore it's up to the script to  make sure that temporary files or folders passed to createChild are correctly removed
   * after sending or failing the job.
   * @param {string} path - a path to the file/folder to create a child job
   * @example
   * async function jobArrived(s, flowElement, job) {
   *  try {
   *    const reportJob = await job.createChild(<path_to_report_file>);
   *    await reportJob.sendToLog(Connection.Level.Success, 'XML');
   *    await job.sendToData(Connection.Level.Success);
   *  } catch(e) {
   *    // catch an error
   *  }
   *  // remove <path_to_report_file> in case no longer needed
   * }
   */
  createChild(path: string): Promise<Job>;

  /**
   * Returns a list of all datasets' names with models and extensions for which a dataset is associated with the job.
   */
  listDatasets(): Promise<{ name: string; model: DatasetModel; extension: string; }[]>;

  /**
   * Creates a new dataset with the specified model and associates it with the specified name. The new dataset will be uploaded when
   * any sendTo method for the job is called. When failing the job, the dataset will not be added.
   * Changing the name, model or extension of a dataset is only possible by creating a new dataset and removing the old one.
   *
   * The values allowed for the dataset model are: XML, JDF, XMP, and Opaque.
   *
   * <b>Note:</b>
   * - Throws an error if neither `name`, `filePath`, nor `model` are specified.
   * - The file or folder that was passed to `createDataset` will not automatically be removed by Switch when sending or failing the job.
   * Therefore it's up to the script to make sure that temporary files or folders passed to `createDataset` are correctly removed
   * after sending or failing the job.
   * @param {string} name - the name for the new dataset
   * @param {string} filePath - the path to the new dataset
   * @param {DatasetModel} model - a model for the dataset (see allowed values)
   * @throws an error if neither `name`, `filePath`, nor `model` are specified.
   */
  createDataset(name: string, filePath: string, model: DatasetModel): Promise<void>;

  /**
   * Removes the dataset with the specified name for the job.
   *
   * <b>Note:</b>
   * - Throws an error in case the dataset does not exist.
   * - Throws an error if no name is specified.
   * @param {string} name - name of the dataset to remove
   * @throws an Error in case the dataset does not exist OR if no `name` is specified
   */
  removeDataset(name: string): Promise<void>;

  /**
   * Returns the file path for the metadata dataset for the job associated with the specified name.
   * When calling any `sendTo` method, the scripting module automatically uploads/replaces the dataset if the dataset was modified.
   * This also means that when failing the job, the dataset will not be changed.
   *
   * <b>Note:</b> If dataset content modification is detected:
   * - If called with AccessLevel.ReadOnly, an error is thrown.
   * - If called with AccessLevel.ReadWrite, the dataset content is updated with the modified content.
   *
   * The above applies to `Job.sendToSingle`, `Job.sendTo`, `Job.sendToLog` and `Job.sendToData`.
   *
   * <b>Important:</b> We strongly advise you not to use AccessLevel.ReadWrite for this call.
   * For more information, refer to [this issue](https://www.enfocus.com/en/support/known-issues-and-solutions#!/SupportPortalSolution?id=5012p000001Su4kAAC)
   * @param {string} name - dataset name
   * @param {AccessLevel} accessLevel - access level for the dataset (`AccessLevel.ReadOnly` or `AccessLevel.ReadWrite`)
   * @throws an error if: unknown `AccessLevel` is provided OR any error that occurs when the dataset content is transferred/accessed.
   * @example
   * const fs = require("fs-extra");
   * async function jobArrived(s, flowElement, job) {
   *  // READ-ONLY example
   *  const tempPath = await job.getDataset(XMLDataset, AccessLevel.ReadOnly);
   *  const content = await fs.readFile(jobPath, { encoding: "utf8" }); // i.e. read file content;
   *  await job.log(LogLevel.Info, "Dataset content is: ", content); // no changes allowed (read-only operation)
   *  await job.sendToSingle();
   * }
   */
  getDataset(name: string, accessLevel: AccessLevel): Promise<string>;
}

/**
 * The single instance of the Switch class is passed as an argument to the script entry points. It
 represents common Switch functionality.
 */
declare class Switch {
  /**
   * Returns the value of a global data variable with the specified scope and tag, or returns an
   * empty string if no global data variable with that scope and tag was set.
   * The lock parameter (false by default) is optional and determines whether or not a lock is set on
   * global data. A lock can be released by calling the setGlobalData function. If the script doesn't
   * update the global data, the data remains locked until the end of the script.
   * @param {Scope} scope - the specified scope
   * @param {string} tag - the requested tag
   * @param {boolean} [lock = false] - Whether or not to set a lock on global data. Releasing of lock is done when calling setGlobalData function. If the script doesn't update the global data, the lock would remain until the end of the script.
   * @returns the value of a global data variable with the specified `scope` and `tag`
   */
  
  getGlobalData(scope: Scope, tag: string, lock?: boolean): Promise<string>;
  /**
   * Returns a list of objects in the format defined above. The result will contain only the data for the
   * provided tags. If non-existing tags are provided, the result will not contain the data for these tags.
   * The lock parameter (false by default) is optional and determines whether or not a lock is set on
   * global data. A lock can be released by calling the setGlobalData function. If the script doesn't
   * update the global data, the data remains locked until the end of the script
   * If non-existing tags are provided, the result will not contain the data for these tags.
   * @param {Scope} scope - the specified scope
   * @param {string[]} tags - the tags requested
   * @param {boolean} [lock = false] - Whether or not to set a lock on global data. Releasing of lock is done when calling setGlobalData function. If the script doesn't update the global data, the lock would remain until the end of the script.   
   * @returns a list of objects in the format defined above
   */
  getGlobalData(scope: Scope, tags: string[], lock?: boolean): Promise<{ tag: string, value: string }[]>;

  /**
   * Sets the value of the global data with the specified scope and tag.
   * @param {Scope} scope - the specified scope
   * @param {string} tag - the specified tag
   * @param {string} value - the value to set for the requested tag
   */
  setGlobalData(scope: Scope, tag: string, value: string): Promise<void>;
  /**
   * Sets the global data values for the specified tags and scope.
   * If global data with the same tag name exists, the value of the global data will be replaced with the new one.
   * @param {Scope} scope - the specified scope
   * @param {{ tag: string, value: string }[]} globalData - global data (pairs of tag => value) to set
   */
  setGlobalData(scope: Scope, globalData: { tag: string, value: string }[]): Promise<void>;

  /**
   * Removes the global data for the specified `scope` and `tag`.
   * @param {Scope} scope - the specified scope
   * @param {string} tag - the specified tag
   * <b>Note:</b> It's recommended to remove global data as soon as it is not needed anymore.
   */
  removeGlobalData(scope: Scope, tag: string): Promise<void>;
  /**
   * Removes the global data for the specified `scope` and `tags`.
   * @param {Scope} scope - the specified scope
   * @param {string[]} tags - the specified tags
   * <b>Note:</b> It's recommended to remove global data as soon as it is not needed anymore.
   */
  removeGlobalData(scope: Scope, tags: string[]): Promise<void>;
}