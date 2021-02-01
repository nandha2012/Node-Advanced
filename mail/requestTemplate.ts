import { globalValues } from "../app";


export const htmlTemp = (userName:string,id:number,day:number) => (`<!doctype html>
<html>           
<head></head>
<body style="background-color:#a59f9f;">
  <h1 align="center" style="color: rgb(48, 12, 23);
  font-family: verdana;
  font-size: 300%;">Hi ${userName} </h1>
  <table style="width:800px;" align="center">
    <tr>
      <td align="center">
        <table align="center" border="0" 
          cellpadding="0" 
          cellspacing="0" 
          style="border-collapse:collapse">
          <tbody>
            <tr>
              <td align="center" bgcolor="#429FFC" height="40" width="270">
                <a href="http://localhost:5000/accept/data?&id=${id}&token=${globalValues.token}&day=${day}" target="_blank"style="font-family:'Roboto',Arial;
                          font-weight:bold;
                          font-size:14px;
                          color:#ffffff!important;
                          text-decoration:none!important;
                          display:block;
                          line-height:40px;text-transform:uppercase">Click To Accept
                </a>
              </td>
            </tr>
          </tbody>
        </table>

      </td>
    </tr>
    <tr>
    <td align="center">
      <table align="center" border="0" 
        cellpadding="0" 
        cellspacing="0" 
        style="border-collapse:collapse">
        <tbody>
          <tr>
            <td align="center" bgcolor="#f54242" height="40" width="270">
              <a href="http://localhost:5000/reject/data?id = ${id}&token=${globalValues.token}" target="_blank"style="font-family:'Roboto',Arial;
                        font-weight:bold;
                        font-size:14px;
                        color:#ffffff!important;
                        text-decoration:none!important;
                        display:block;
                        line-height:40px;text-transform:uppercase">Click To Reject
              </a>
            </td>
          </tr>
        </tbody>
      </table>

    </td>
  </tr>
  </table>

</body>

</html>`)