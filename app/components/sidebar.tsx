import { useEffect, useRef, useState } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";

import ZfbandWx from "../icons/zfbandwx.svg";
import Locale from "../locales";
import { UPDATE_URL1 } from "../constant";
import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import Linka from "next/link";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { request } from "http";
import { showConfirm, showToast } from "./ui-lib";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}
function Modal(props: any) {
  const { show, handleClose, children } = props;

  return (
    <div>
      {show && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            {/* <span className="close" onClick={handleClose}>
              &times;
            </span> */}
            <span className={styles["modal-content-span"]}>
              友情提醒: chatgpt账号30元，可直接在镜像中使用，也可在官网使用。
              <br />
              支付完请带着支付截图，
              <br />
              <span className={styles["sidebar-sub-red"]}>
                联系微信:boaibo0626 或者QQ:1223577600 领取你的账号
              </span>
            </span>
            {children}
            <div className={styles["modal-content-btn"]}>
              <IconButton
                className={styles["sidebar-bar-button"]}
                text="返回"
                onClick={handleClose}
              ></IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const [showModal, setShowModal] = useState(false);
  useHotKey();
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    >
      <div className={styles["sidebar-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-title"]} data-tauri-drag-region>
          搏老师的chatGPT镜像
        </div>
        <div className={styles["sidebar-sub-title"]}>
          搭建镜像不易,还望各位支持！
        </div>
        <div className={styles["sidebar-sub-title"]}>
          key30元一个,买key送chatgpt账号送谷歌邮箱
          <br />
          <span className={styles["sidebar-sub-red"]}>
            承诺:一人一号，改一赔十
          </span>
        </div>
        <div className={styles["sidebar-sub-SP"]}>
          <span className={styles["sidebar-sub-text"]}>直接购买:</span>
          <div className={styles["sidebar-sub-reds"]}>
            <IconButton
              className={styles["sidebar-bar-button"] + " sidebar-bar-buttons"}
              text="支付宝"
              onClick={() => {
                setShowModal(true);
              }}
            ></IconButton>
            <IconButton
              className={styles["sidebar-bar-button"]}
              text="微信"
              onClick={() => {
                setShowModal(true);
              }}
            ></IconButton>
          </div>
          {/* <Linka
            href={UPDATE_URL1}
            target="_blank"
            className={styles["links"] + "link"}
          >
            {"赞赏一下,以致鼓励"}
          </Linka> */}
        </div>

        <div className={styles["sidebar-logo"] + " no-dark"}>
          <ChatGptIcon />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : Locale.Mask.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.NewChat, { state: { fromHome: true } })}
          shadow
        />
        <IconButton
          icon={<PluginIcon />}
          text={shouldNarrow ? undefined : Locale.Plugin.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => showToast(Locale.WIP)}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={async () => {
                if (await showConfirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} shadow />
            </Link>
          </div>
          {/* <div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div> */}
        </div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              if (config.dontShowMaskSplashScreen) {
                chatStore.newSession();
                navigate(Path.Chat);
              } else {
                navigate(Path.NewChat);
              }
            }}
            shadow
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
      <Modal show={showModal} handleClose={handleClose}>
        {<img className={styles["sidebar-img"]} src="/wxandzfb.png"></img>}
      </Modal>
    </div>
  );
}
