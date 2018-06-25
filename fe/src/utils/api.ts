import Xhr from './Xhr';
import {RESPONSE_SUCCESS} from './consts';
import {UploadFile} from '../types/types';

export default class Api {
  private xhr: Xhr;

  constructor(xhr: Xhr) {
    this.xhr = xhr;
  }

  public login(form: HTMLFormElement, cb: ErrorCB<string>) {
    this.xhr.doPost('/auth', null, (res, error) => {
      if (error) {
        cb(null, error);
      } else {
        try {
          let pr = JSON.parse(res);
          if (pr.session) {
            localStorage.setItem('session_id', pr.session);
            cb(pr.session, null);
          } else if (pr.error) {
            cb(null, pr.error);
          } else {
            cb(null, 'Unknown error');
          }
        } catch (e) {
          if (res) {
            cb(null, res);
          }  else {
            cb(null, 'Unable to parse response from server');
          }
        }
      }
    }, new FormData(form));
  }


  public sendLogs(issue: string, browser: string, cb: SingleParamCB<string> = null) {
    this.xhr.doPost('/report_issue', {issue, browser}, this.getResponseSuccessCB(cb));
  }

  public logout(cb: SingleParamCB<string>, registration_id: string = null) {
    this.xhr.doPost('/logout', {registration_id}, (d, e) => {
        if (e) {
         e = `Error while logging out ${e}`;
        }
        cb(e);
    });
  }

  public sendRestorePassword(form: HTMLFormElement, cb: SingleParamCB<string>) {
    this.xhr.doPost(
        '/send_restore_password',
        null,
        this.getResponseSuccessCB(cb),
        new FormData(form)
    );
  }

  public register(form: HTMLFormElement, cb: ErrorCB<string>) {
    this.xhr.doPost('/register', null, (res, error) => {
      if (error) {
        cb(null, error);
        return;
      }
      try {
        let pr = JSON.parse(res);
        if (pr.session) {
          cb(pr.session, null);
        } else if (pr.error) {
          cb(null, pr.error);
        } else {
          cb(null, 'Unknown error');
        }
      } catch (e) {
        if (res) {
          cb(null, res);
        }  else {
          cb(null, 'Unable to parse response from server');
        }
      }
    }, new FormData(form));
  }

  public validateUsername(username: string, cb: SingleParamCB<string>) {
    this.xhr.doPost('/validate_user', {username},  this.getResponseSuccessCB(cb));
  }

  private getResponseSuccessCB(cb: SingleParamCB<string>) {
    return (data, error) => {
      if (!cb) {
      } else if (error) {
        cb(error);
      } else if (data === RESPONSE_SUCCESS) {
        cb(null);
      } else if (data) {
        cb(data);
      } else {
        cb('Unknown error');
      }
    };
  }

  public sendRoomSettings(roomName, volume, notifications, roomId, cb: SingleParamCB<string>) {
    this.xhr.doPost(
        '/save_room_settings',
        {roomName, volume, notifications, roomId},
        this.getResponseSuccessCB(cb)
    );
  }


  public uploadFiles(files: UploadFile[], cb: Function, progress: Function) {
    let fd = new FormData();
    files.forEach(function(sd) {
      fd.append(sd.type + sd.symbol, sd.file, sd.file.name);
    });
    this.xhr.doPost('/upload_file', null,  (data, error) => {
      if (error) {
        cb(null, error);
      } else {
        let parse;
        try {
          parse = JSON.parse(data);
        } catch (e) {
          cb(null, 'Unable to parse response');
          return;
        }
        cb(parse);
      }
    }, fd, null, r => {
      r.upload.addEventListener('progress', progress);
    });
  }

  public validateEmail(email: string, cb: SingleParamCB<string>) {
    this.xhr.doPost('/validate_email', {email},  this.getResponseSuccessCB(cb));
  }
}