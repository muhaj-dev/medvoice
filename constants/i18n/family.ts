/**
 * family screen strings (English source). Filled per-feature; merged into
 * EN_STRINGS by constants/strings.ts. Keys are namespaced "family.*".
 */
export const familyStrings = {
  // Family tab screen
  "family.headingFamily": "Family",
  "family.headingConnection": "Connection",
  "family.subtitle": "Private P2P · No cloud server",
  "family.connected": "CONNECTED",
  "family.reconnect": "RECONNECT",
  "family.reconnecting": "RECONNECTING",
  "family.emptyTitle": "No family members yet",
  "family.emptyBody": "Share health summaries privately with family using the options below",

  // Share consent alerts (index + show-code)
  "family.nothingToShare": "Nothing to share yet",
  "family.healthDataShared": "Health data shared",
  "family.syncIncomplete": "Sync incomplete",
  "family.noEntriesYetPrefix": "You have no saved entries yet. New entries will sync to ",
  "family.noEntriesYetSuffix": " automatically.",
  "family.sentPrefix": "Sent ",
  "family.sentEntrySingular": " entry",
  "family.sentEntryPlural": " entries",
  "family.sentToPrefix": " to ",
  "family.sentToSuffix": ".",
  "family.sentOf": " of ",
  "family.mayBeOfflinePrefix": ". ",
  "family.mayBeOfflineSuffix": " may be offline — the rest will sync when you reconnect.",
  "family.shareTitle": "Share your health data?",
  "family.shareBodyPrefix": "Allow ",
  "family.shareBodySuffix":
    " to see your health history and future updates? You can change this anytime from their card on the Family tab.",
  "family.notNow": "Not now",
  "family.share": "Share",
  "family.unableToShare": "Unable to share",
  "family.somethingWentWrong": "Something went wrong. Please try again.",

  // AddFamilyMemberSection
  "family.addAFamilyMember": "ADD A FAMILY MEMBER",
  "family.showMyCode": "SHOW MY\nCODE",
  "family.scanCode": "SCAN CODE",

  // HowP2PWorksCard
  "family.howP2PWorks": "HOW P2P WORKS",
  "family.step1": "Both phones need internet briefly",
  "family.step2": "One person shows their QR code",
  "family.step3": "The other person scans it",
  "family.step4": "Connected! Health updates sync automatically",

  // P2PMeshBanner
  "family.meshActivePrefix": "P2P MESH ACTIVE · ",
  "family.meshActiveSuffix": " CONNECTED",

  // FamilyMemberCard
  "family.timeNever": "Never",
  "family.timeJustNow": "Just now",
  "family.timeMinutesAgo": "m ago",
  "family.timeHoursAgo": "h ago",
  "family.timeDaysAgo": "d ago",
  "family.online": "ONLINE",
  "family.offline": "OFFLINE",

  // Relationship chips
  "family.relationshipLabel": "RELATIONSHIP",
  "family.relDaughter": "Daughter",
  "family.relSon": "Son",
  "family.relParent": "Parent",
  "family.relSibling": "Sibling",
  "family.relPartner": "Partner",
  "family.relOther": "Other",
  "family.relMother": "Mother",
  "family.relFather": "Father",
  "family.relSpouse": "Spouse",

  // ConnectMemberModal
  "family.whoJustConnected": "Who just connected?",
  "family.theirName": "Their name",
  "family.confirm": "CONFIRM",

  // ScanConnectModal
  "family.whoIsThis": "Who is this?",
  "family.connect": "CONNECT →",

  // EditMemberModal
  "family.editFamilyMember": "Edit family member",
  "family.shareMyHealthData": "Share my health data",
  "family.shareMyHealthDataSub": "They receive your entries, past and future",
  "family.saveChanges": "SAVE CHANGES",
  "family.removeMember": "REMOVE MEMBER",
  "family.removeFamilyMember": "Remove family member?",
  "family.removeBodyPrefix": "",
  "family.removeBodySuffix": " will no longer receive your health summaries.",
  "family.cancel": "Cancel",
  "family.remove": "Remove",

  // ManualCodeModal
  "family.enterCodeManually": "Enter code manually",
  "family.enterCodeSubtitle": "Paste the connection code your family member shared with you.",
  "family.pasteCodePlaceholder": "Paste their code here",
  "family.pasteFromClipboard": "PASTE FROM CLIPBOARD",
  "family.next": "NEXT →",

  // ShowCodeContent + show-code screen
  "family.back": "← BACK",
  "family.yourDeviceCode": "Your Device Code",
  "family.yourDeviceCodeSubtitle":
    "Ask your family member to scan this code with their MedVoice app",
  "family.couldNotGenerate": "Could not generate device code.",
  "family.retry": "RETRY",
  "family.copied": "✓  COPIED",
  "family.copyCode": "COPY CODE",
  "family.generatingCode": "Generating code…",

  // WaitingForScanStatus
  "family.connectedCheck": "CONNECTED ✓",
  "family.waitingForScan": "WAITING FOR SCAN...",
  "family.uniqueToDevice": "This code is unique to your device.",
  "family.encryptedEndToEnd": "Health data is encrypted end-to-end.",

  // ScanCodeBody + scan-code screen
  "family.scanFamilyCode": "Scan Family Member's Code",
  "family.pointCamera": "Point your camera at their QR code",
  "family.detectedAutomatically":
    "The code will be detected automatically.\nNo need to tap anything.",
  "family.noQrEnterManually": "NO QR CODE? ENTER CODE MANUALLY",
  "family.requestingCameraAccess": "Requesting camera access…",

  // QRScannerViewfinder
  "family.cameraNotAvailable": "Camera not available",
  "family.waitingForCamera": "Waiting for camera…",
  "family.codeDetected": "✓  Code detected!",

  // CameraPermissionError
  "family.cameraAccessRequired": "Camera access required",
  "family.cameraAccessSubtitle": "Enable camera access in Settings to scan QR codes.",
  "family.enableCamera": "ENABLE CAMERA",
} as const;
