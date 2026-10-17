import { SystemPermissionFlag } from 'twenty-sdk/define';

// What every member who works in the CRM needs: connect their own mailbox and
// calendar, edit their profile, open files already on a record. Upload is
// left out on purpose: documents never go into Twenty (kuec/CLAUDE.md section 4).
export const TEAM_MEMBER_TOOL_FLAGS = [
  SystemPermissionFlag.CONNECTED_ACCOUNTS,
  SystemPermissionFlag.PROFILE_INFORMATION,
  SystemPermissionFlag.DOWNLOAD_FILE,
];
