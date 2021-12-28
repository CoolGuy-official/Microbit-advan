enum exter_ports2 {
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum exter_ports3 {
    //% block="AD0"
    J1,
    //% block="IO1"
    J2,
    //% block="IO2"
    J3,
    //% block="IO16"
    J4,
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum SoundSensor_Mode {
    //% block=MODE_ASR
    MODE_ASR = 1,
    //% block=MODE_TTS
    MODE_TTS = 2,
    //% block=MODE_WORD
    MODE_WORD = 4,
    //% block=MODE_DIA
    MODE_DIA = 8
}

enum VisionSensor_Mode {
    //% block=CARD
    CARD = 7,
    //% block=FACERCG
    FACERCG = 6,
    //% block=MOVINGOBJECT
    MOVINGOBJECT = 5,
    //% block=FACE
    FACE = 4,
    //% block=BODY
    BODY = 3,
    //% block=LINE
    LINE = 2,
    //% block=BALL
    BALL = 1
}

enum VisionDetect_Card {
    //% block=Card_Squar
    Card_Squar = 3,
    //% block=Card_Trian
    Card_Trian = 2,
    //% block=Card_Round
    Card_Round = 1
}

enum VisionDetect_Others {
    //% block=FACERCG
    FACERCG = 6,
    //% block=MOVINGOBJECT
    MOVINGOBJECT = 5,
    //% block=FACE
    FACE = 4,
    //% block=BODY
    BODY = 3,
    //% block=LINE
    LINE = 2,
    //% block=BALL
    BALL = 1
}

enum TalkerPin {
    //% block=P13/14
    P13 = 113,
    //% block=P15/16
    P15 = 115
}

enum TalkerWords {
    //% block=开机
    wakeup = 0,
    //% block=播放音乐
    play,
    //% block=关闭音乐
    stop,
    //% block=更换音乐
    next,
    //% block=调高音量
    highv,
    //% block=降低音量
    downv,
    //% block=打开音乐盒
    openv,
    //% block=歌曲一
    song1,
    //% block=歌曲二
    song2,
    //% block=歌曲三
    song3,
    //% block=打开洗衣机
    mrun0,
    //% block=打开摩天轮
    mrun1,
    //% block=打开电风扇
    mrun2,
    //% block=打开电机
    mrun3,
    //% block=小车前进
    crun0,
    //% block=小车右转
    crun1,
    //% block=小车左转
    crun3,
    //% block=小车后退
    crun2,
    //% block=打开
    open,
    //% block=关闭
    close,
    //% block=开灯
    lion,
    //% block=关灯
    lioff,
    //% block=降低
    low,
    //% block=提高
    high,
    //% block=开始
    start,
    //% block=结束
    end,
    //% block=开始计时
    clock,
    //% block=关闭定时
    clock0,
    //% block=定时结束
    timeup,
}
const TalkerWordsStr = ['wakeup', 'play', 'stop', 'next', 'highv', 'downv', 'openv', 'song1', 'song2', 'song3', 'mrun0', 'mrun1', 'mrun2', 'mrun3', 'crun0', 'crun1', 'crun3', 'crun2', 'open', 'close', 'lion', 'lioff', 'low', 'high', 'start', 'end', 'clock', 'clock0', 'timeup'];

enum TalkerCmd {
    //% block=你好
    hello = 0,
    //% block=再见
    goodbye,
    //% block=时间到
    timeout,
}
const TalkerCmdStr = ['\u0001', '\u0002', '\u0003', '\u0004', '\u0005', '\u0006', '\u0007', '\u0008', '\u0009', '\u0010', '\u0011', '\u0012', '\u0013', '\u0014', '\u0015', '\u0016', '\u0017', '\u0018', '\u0019', '\u0020'];

/**
 * Coolguy advanced extension
 */
//% weight=104 color=#ffc500 icon="\uf17b"
//% groups=['CoolTalker','wtr50_1', 'SoundSensor', 'WIFI']
namespace Coolguy_advan {
    //------------------------语音模块--------------------------------

    //% blockId=CoolTalker_Init group=CoolTalker
    //% block="初始化小酷宝在 %pin| "
    export function TalkerInit(pin: TalkerPin) {
        serial.redirect(pin + 1, pin + 0, 9600);
    }

    //% blockId=CoolTalker_when_receive group=CoolTalker
    //% block="当听见 %wordword=TalkerWord |||"
    //% expandableArguementMode=enable deprecated=true
    export function WhenReceiveWord(word: string, body?: () => void) {
        let talkres = '';
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            talkres = serial.readString();
        });
        basic.showString(talkres);
        basic.showString(word);
        if (talkres == word) {
            body();
        }
    }

    let talkres = '';
    //% blockId=CoolTalker_isheard group=CoolTalker
    //% block="是否听见%word=TalkerWord?"
    export function isHeard(word: string) {
        let talktmp = serial.readString();
        if (talktmp != '') {
            if (talktmp === word + '\n') {
                return true;
            }
            talkres = talktmp;
            return false;
        }
        else {
            if (talkres === word + '\n') {
                talkres = '';
                return true;
            }
            return false;
        }
    }

    //% blockId=CoolTalker_sendcmd group=CoolTalker
    //% block="小酷宝说 %str| "
    //% str.fieldEditor="gridpicker" str.fieldOptions.columns=4
    //% str.fieldOption.tooltips="false"
    //% str.fieldOptions.width="250"
    export function Sendcmd(cmd: TalkerCmd) {
        serial.writeString("st")
        serial.writeString(TalkerCmdStr[cmd])
        serial.writeString("ed")
    }

    //% blockId=TalkerWord block="%word"
    //% blockGap=8 group=CoolTalker
    //% word.fieldEditor="gridpicker" word.fieldOptions.columns=6
    //% word.fieldOptions.tooltips="false" 
    //% word.fieldOptions.width="250"
    export function TalkerWord(word: TalkerWords): string {
        return TalkerWordsStr[word];
    }
    
    //----------------------WIFI-------------------------------------
    let RevBuf = ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"];
    let WIFI_Tx: SerialPin;
    let WIFI_Rx: SerialPin;

    /**
     * WIFI init
     */
    //% blockId=coolguy_iCloudMemory_Serial_Init
    //% block="WIFI init at %exterpin|"
    //% group=WIFI
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function iCloudMemory_Serial_Init(exterpin: exter_ports2) {
        switch (exterpin) {
            case exter_ports2.J5:
                WIFI_Tx = SerialPin.P14;
                WIFI_Rx = SerialPin.P13;
                break;
            case exter_ports2.J6:
                WIFI_Tx = SerialPin.P16;
                WIFI_Rx = SerialPin.P15;
                break;
            default:
                break;
        }
        serial.redirect(WIFI_Tx, WIFI_Rx, 9600);
        basic.pause(100);
        iCloudMemory_iCloud_Read_String("000000000000", 1);
    }

    /**
    * WIFI setting
    * @param SSID ID, eg: "CoolGuyRobot"
    * @param PASSWORD Key, eg: robotrobot
    */
    //% blockId=coolguy_iCloudMemory_WiFi_SSIDPWD_Config
    //% block="Set WIFI account %SSID| and password %PASSWORD|"
    //% group=WIFI
    export function iCloudMemory_WiFi_SSIDPWD_Config(SSID: string, PASSWORD: string) {
        let Rcv = "";
        let buf = control.createBuffer(1);
        buf[0] = 0;
        let i: number;

        do {
            do {
                serial.writeString("#");
                serial.writeString("#");
                serial.writeString("#");

                serial.writeString(SSID);
                for (i = 0; i < 20 - SSID.length; i++) {
                    serial.writeBuffer(buf);
                }
                serial.writeString(PASSWORD);
                for (i = 0; i < 20 - PASSWORD.length; i++) {
                    serial.writeBuffer(buf);
                }
                serial.writeString("\r\n");
                basic.pause(500);

                Rcv = serial.readString();
            } while (Rcv === ""); //Serial.available() <= 0
        } while (Rcv.indexOf("OK") < 0);
    }

    /**
     * WIFI read strings
     * @param MACaddr the adress of MAC, eg: "2C3AE81ED2C1"
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Read_String
    //% block="WIFI read strings from MAC %MACaddr| and cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloud_Read_String(MACaddr: string, addr: number): string {
        let rev = "";
        let revtmp = "";
        let Timeout = 0;

        while (serial.readString() !== "");
        //判断是否是公共云，如果是公共云则不限定其云地址，不是公共云则限定云地址为0~20之间
        if (MACaddr === "000000000000") {
            serial.writeString(MACaddr);
            serial.writeString("&R");
            serial.writeString(addr.toString() + '\r\n');
            // delay(100);

            Timeout = 0;
            do {
                revtmp = serial.readString();
                rev += revtmp;
                Timeout++;
                if (Timeout >= 30) {
                    return RevBuf[addr];
                }
                basic.pause(10);
            } while (revtmp === "");
            RevBuf[addr] = rev;
        }
        else {
            if (addr > 0 && addr < 21) {
                serial.writeString(MACaddr);
                serial.writeString("&R");
                serial.writeString(addr.toString())
                serial.writeString('\r\n');
                //basic.pause(100);

                Timeout = 0;
                do {
                    revtmp = serial.readString();
                    rev += revtmp;
                    Timeout++;
                    if (Timeout >= 30) {
                        return RevBuf[addr];
                    }
                    basic.pause(100);
                } while (revtmp === "");
                RevBuf[addr] = rev;
            }
            else {
                basic.showNumber(2);
                RevBuf[addr] = "-1";
            }
        }
        return RevBuf[addr];
    }

    /**
     * WIFI read number
     * @param MACaddr the adress of MAC, eg: "2C3AE81ED2C1"
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Read_Float
    //% block="WIFI read number from MAC %MACaddr| and cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloud_Read_Float(MACaddr: string, addr: number): number {
        let rev = "";
        let revtmp = "";
        let Time_out = 0;

        while (serial.readString() !== "");

        //判断是否是公共云，如果是公共云则不限定其云地址，不是公共云则限定云地址为0~20之间
        if (MACaddr == "000000000000") {
            serial.writeString(MACaddr);
            serial.writeString("&R");
            serial.writeString(addr.toString() + '\r\n');
            // delay(100);

            Time_out = 0;
            do {
                revtmp = serial.readString();
                rev += revtmp;
                Time_out++;
                if (Time_out >= 30) {
                    return parseFloat(RevBuf[addr]);
                }
                basic.pause(10);
            } while (revtmp == "");
            RevBuf[addr] = rev;
        }
        else {
            if (addr > 0 && addr < 21) {
                serial.writeString(MACaddr);
                serial.writeString("&R");
                serial.writeString(addr.toString() + '\r\n');
                // delay(100);

                Time_out = 0;
                do {
                    revtmp = serial.readString();
                    rev += revtmp;
                    Time_out++;
                    if (Time_out >= 30) {
                        return parseFloat(RevBuf[addr]);
                    }
                    basic.pause(10);
                } while (revtmp == "");
                RevBuf[addr] = rev;
            } else {
                return parseFloat(RevBuf[addr]);
            }
        }
        return parseFloat(RevBuf[addr]);
    }

    /**
     * WIFI send strings
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Write_String
    //% block="WIFI send strings %data| to cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloud_Write_str(data: string, addr: number) {
        if (addr > 0 && addr < 21) {
            while (serial.readString() != "");
            serial.writeString("&W");
            serial.writeString(addr.toString());
            serial.writeString(" ");
            serial.writeString(data + '\r\n');
        }
    }

    /**
     * WIFI send number 
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Write_Number
    //% block="WIFI send number %data| to cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloud_Write_num(data: number, addr: number) {
        if (addr > 0 && addr < 21) {
            while (serial.readString() != "");
            serial.writeString("&W");
            serial.writeString(addr.toString());
            serial.writeString(" ");
            serial.writeString(data.toString() + '\r\n');
        }
    }

    /**
     * WIFI send strings to common cloud
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudShare_Write_String
    //% block="WIFI send strings %data| to common cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloudShare_Write_str(data: string, addr: number) {
        while (serial.readString() != "");
        serial.writeString("&S");
        serial.writeString("000000000000");
        serial.writeString(" ");
        serial.writeString(addr.toString());
        serial.writeString(" ");
        serial.writeString(data + '\r\n');
    }

    /**
     * WIFI send number to common cloud
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudShare_Write_Number
    //% block="WIFI send number %data| to common cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloudShare_Write_num(data: number, addr: number) {
        while (serial.readString() != "");
        serial.writeString("&S");
        serial.writeString("000000000000");
        serial.writeString(" ");
        serial.writeString(addr.toString());
        serial.writeString(" ");
        serial.writeString(data.toString() + '\r\n');
    }

    /**
     * WIFI read strings from common cloud
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudCommon_Read_String
    //% block="WIFI read strings from common cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloudCommon_Read_Str(addr: number): string {
        return iCloudMemory_iCloud_Read_String("000000000000", addr);
    }

    /**
     * WIFI read number from common cloud
     * @param addr the adress of iCloud, eg: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudCommon_Read_Number
    //% block="WIFI read number from common cloud %addr|"
    //% addr.min=1
    //% group=WIFI
    export function iCloudMemory_iCloudCommon_Read_Num(addr: number): number {
        return iCloudMemory_iCloud_Read_Float("000000000000", addr);
    }

    //----------------------人工智能模块------------------------------
    let SS_TX = SerialPin.P14;
    let SS_RX = SerialPin.P13;
    let i = 0, j = 0;
    let SS_valid: boolean;
    let asr_result: string;
    let buf = control.createBuffer(4);

    function SoundSensor_Search() {
        SS_valid = false;
        asr_result = "";
        let Rcvtmp = "";

        Rcvtmp = serial.readString();
        while (Rcvtmp !== "") {
            SS_valid = true;
            asr_result += Rcvtmp;
            Rcvtmp = serial.readString();
            basic.pause(2);
        }
    }

    /**
     * port setting
     */
    //% blockId=SoundSensor_SetPort
    //% block="Set port at %exterpin|"
    //% group=SoundSensor
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function SoundSensor_SetPort(exterpin: exter_ports2) {
        switch (exterpin) {
            case exter_ports2.J5:
                SS_TX = SerialPin.P14;
                SS_RX = SerialPin.P13;
                break;
            case exter_ports2.J6:
                SS_TX = SerialPin.P16;
                SS_RX = SerialPin.P15;
                break;
            default: break;
        }
        serial.redirect(SS_TX, SS_RX, 115200);
    }

    /**
     * SoundSenor init
     */
    //% blockId=SoundSensor_WaitInit
    //% block="wait init finished"
    //% group=SoundSensor
    export function SoundSensor_WaitInit(): void {
        let Rcv = "";

        do {
            do {
                buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
                buf.setNumber(NumberFormat.UInt8LE, 1, 0xfd);
                buf.setNumber(NumberFormat.UInt8LE, 2, 0x0a);
                buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
                serial.writeBuffer(buf);
                basic.pause(100);

                Rcv = serial.readString();
            } while (Rcv === "");
        } while (Rcv.indexOf("OK") < 0);
        basic.pause(100);
    }

    /**
     * Start sound record
     */
    //% blockId=SoundSensor_Start_conversation
    //% block="Start sound recording"
    //% group=SoundSensor
    export function SoundSensor_Start_conversation(): void {
        if (i == 0)//为了按键一直按下，只发一次数据，而不是一直发送数据。
        {
            i = 1;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x01);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
    }

    /**
     * Stop sound recording
     */
    //% blockId=SoundSensor_End_conversation
    //% block="Stop sound recording"
    //% group=SoundSensor
    export function SoundSensor_End_conversation(): void {
        if (i == 1) {
            i = 0;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x02);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
    }

    /**
     * Press the button to speak
     */
    //% blockId=SoundSensor_Vocice_conversation
    //% block="Press the button to speak %num|"
    //% group=SoundSensor
    export function SoundSensor_Vocice_conversation(num: number) {
        if (j == 0 && num == 1)//为了按键一直按下，只发一次数据，而不是一直发送数据。
        {
            j = 1;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x01);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
        if (j == 1 && num == 0) {
            j = 0;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x02);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
    }

    /**
     * Account and Password setting
     * @param SSID ID, eg: "CoolGuyRobot"
     * @param PASSWORD Key, eg: robotrobot
     */
    //% blockId=SoundSensor_SetWiFi
    //% block="Set account %SSID| and password %PASSWORD|"
    //% group=SoundSensor
    export function SoundSensor_SetWiFi(SSID: string, PASSWORD: string) {
        let Temp = control.createBuffer(1);
        Temp[0] = 0;
        let Rcv: string;

        do {
            do {
                buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
                buf.setNumber(NumberFormat.UInt8LE, 1, 0xfb);
                buf.setNumber(NumberFormat.UInt8LE, 2, 0x0a);
                buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
                serial.writeBuffer(buf);

                serial.writeString(SSID);
                for (let i = 0; i < 20 - SSID.length; i++)
                    serial.writeBuffer(Temp);
                serial.writeString(PASSWORD);
                for (let i = 0; i < 20 - PASSWORD.length; i++)
                    serial.writeBuffer(Temp);
                serial.writeString('\r\n');
                basic.pause(500);

                Rcv = serial.readString();
            } while (Rcv === "");
        } while (Rcv.indexOf("OK") < 0);
    }

    /**
     * Mode setting
     */
    //% blockId=SoundSensor_Setmode
    //% block="Set SoundSensor mode as %mode|"
    //% group=SoundSensor
    export function SoundSensor_SetMode(mode: SoundSensor_Mode) {
        let modebuf = control.createBuffer(4);
        switch (mode) {
            case SoundSensor_Mode.MODE_ASR:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x01;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
            case SoundSensor_Mode.MODE_TTS:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x02;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
            case SoundSensor_Mode.MODE_WORD:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x04;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
            case SoundSensor_Mode.MODE_DIA:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x08;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
        }
        basic.pause(2000);
    }

    /**
     * Is result of sound or talk there
     */
    //% blockId=SoundSensor_Result_flag
    //% block="Is result of sound or talk there?"
    //% group=SoundSensor
    export function SoundSensor_Result_flag(): boolean {
        SoundSensor_Search();
        return SS_valid;
    }

    /**
     * The result of sound or talk
     */
    //% blockId=SoundSensor_AsrResult
    //% block="The result of sound or talk"
    //% group=SoundSensor
    export function SoundSensor_AsrResult(): string {
        return asr_result;
    }

    /**
     * SoundSensor sends message
     */
    //% blockId=SoundSensor_TtsContent
    //% block="Send the message %str| of sound or talk"
    //% group=SoundSensor
    export function SoundSensor_TtsContent(str: string) {
        serial.writeString(str);
        basic.pause(2000);
    }

    //----------------------多路语音----------------------------------
    let wtr050_pin: DigitalPin;
    let tstime = 0;
    function wtr050_sendbyte(val: number): void {
        let i: number;

        pins.digitalWritePin(wtr050_pin, 0);
        control.waitMicros(104);
        for (i = 0; i < 8; i++) {
            if (val & 0x01)
                pins.digitalWritePin(wtr050_pin, 1);
            else
                pins.digitalWritePin(wtr050_pin, 0);
            control.waitMicros(tstime);
            val >>= 1;
        }
        pins.digitalWritePin(wtr050_pin, 1);
        control.waitMicros(104);
    }

    /**
     * wtr50 init
     */
    //% blockId=coolguy_wtr050_Init
    //% block="Board%bversion|Set port at %pin|"
    //% group=wtr50_1
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function wtr050_Init(bversion: BoardType, exterpin: exter_ports3) {
        if (bversion) {
            tstime = 106;
        }
        else {
            tstime = 74;
        }
        switch (exterpin) {
            case exter_ports3.J1:
                wtr050_pin = DigitalPin.P0;
                break;
            case exter_ports3.J2:
                wtr050_pin = DigitalPin.P1;
                break;
            case exter_ports3.J3:
                wtr050_pin = DigitalPin.P2;
                break;
            case exter_ports3.J4:
                wtr050_pin = DigitalPin.P16;
                break;
            case exter_ports3.J5:
                wtr050_pin = DigitalPin.P13;
                break;
            case exter_ports3.J6:
                wtr050_pin = DigitalPin.P15;
                break;
        }

        pins.digitalWritePin(wtr050_pin, 1);
        basic.pause(1000);  //wait init
    }

    /**
     * wtr50 start recording
     * @param chan the channel of voice, eg: 1
     */
    //% blockId=coolguy_wtr050_recordstart
    //% block="Start recording at channel %chan|"
    //% chan.min=1  chan.max=6
    //% group=wtr50_1
    export function wtr050_recordstart(chan: number): void {
        wtr050_sendbyte(0xff);
        basic.pause(10);
        wtr050_sendbyte(0x55);
        basic.pause(10);
        wtr050_sendbyte(0x01);
        basic.pause(10);
        wtr050_sendbyte(chan);
        basic.pause(10);
    }

    /**
     * wtr50 stop recording
     */
    //% blockId=coolguy_wtr050_recordstop
    //% block="Stop recording"
    //% chan.min=1  chan.max=6
    //% group=wtr50_1
    export function wtr050_recordstop(): void {
        wtr050_sendbyte(0xff);
        basic.pause(10);
        wtr050_sendbyte(0x55);
        basic.pause(10);
        wtr050_sendbyte(0x02);
        basic.pause(10);
        basic.pause(200);
    }

    /**
     * Play recording
     * @param chan the channel of voice, eg: 1
     */
    //% blockId=coolguy_wtr050_playvoice
    //% block="Play recoding at channel %chan|"
    //% chan.min=1  chan.max=6
    //% group=wtr50_1
    export function wtr050_playvoice(chan: number): void {
        wtr050_sendbyte(0xff);
        basic.pause(10);
        wtr050_sendbyte(0x55);
        basic.pause(10);
        wtr050_sendbyte(0x03);
        basic.pause(10);
        wtr050_sendbyte(chan);
        basic.pause(10);
    }

    /**
     * Stop playing recording
     */
    //% blockId=coolguy_wtr050_stopvoice
    //% block="Stop playing"
    //% chan.min=1  chan.max=6
    //% group=wtr50_1
    export function wtr050_stopvoice(): void {
        wtr050_sendbyte(0xff);
        basic.pause(10);
        wtr050_sendbyte(0x55);
        basic.pause(10);
        wtr050_sendbyte(0x04);
        basic.pause(10);
        basic.pause(100);
    }
}