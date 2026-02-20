"use client";
import InputField from "@/components/ui/InputField";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import Pagination from "@/components/ui/pagination";
import Tabs from "@/components/ui/Tab";
import Alert from "@/components/ui/Alert";
import Step from "@/components/ui/Step";
import MenuLink from "@/components/ui/MenuLink";
import { UserRound } from 'lucide-react';
import Tag from "@/components/ui/Tag";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";

const baseColors = [
  { name: "Gray 0", hex: "#070C1B", className: "bg-brand-gray-0" },
  { name: "Gray 100", hex: "#21263F", className: "bg-brand-gray-100" },
  { name: "Gray 200", hex: "#565F7E", className: "bg-brand-gray-200" },
  { name: "Gray 300", hex: "#8B93B0", className: "bg-brand-gray-300" },
  { name: "Gray 400", hex: "#C8CEDD", className: "bg-brand-gray-400" },
  { name: "White", hex: "#FFFFFF", className: "bg-white" },
];

const brandColors = [
  { name: "Blue 100", hex: "#4E7BEE", className: "bg-brand-blue-100" },
  { name: "Blue 200", hex: "#1E29A8", className: "bg-brand-blue-200" },
  { name: "Blue 300", hex: "#0C1580", className: "bg-brand-blue-300" },
  { name: "Green", hex: "#00A372", className: "bg-brand-green" },
  { name: "Red", hex: "#E5364B", className: "bg-brand-red" },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [textArea, setTextArea] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
  });
  const [selected, setSelected] = useState("1");

  // ตัวอย่าง pagination
  const [currentPage, setCurrentPage] = useState(1);
  function handlePageChange(newPage: number): void {
    console.log("Current page:", newPage);
    setCurrentPage(newPage);
  }
  // ตัวอย่าง tabs
  const [currentTab, setCurrentTab] = useState("tab1");

  const tabItems = [
    { id: "tab1", label: "General Info" },
    { id: "tab2", label: "System Settings" },
    { id: "tab3", label: "Usage History" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-brand-gray-0 px-6 py-8 text-white">
      <div className="w-fit">
        <section className="mb-10 grid gap-40 rounded-lg border border-brand-gray-100 p-6 lg:grid-cols-2">
          <div>
            <p className="text-body-2 text-brand-gray-300">Color</p>
            <h1 className="mt-1 text-headline-2">Colors</h1>

            <h2 className="mt-6 text-headline-4 text-white">Base</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {baseColors.map((color) => (
                <div key={color.name}>
                  <div className={`h-14 w-full ${color.className}`} />
                  <p className="mt-2 text-body-2 text-white">{color.name}</p>
                  <p className="text-body-3 text-brand-gray-300">{color.hex}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-6 text-headline-4 text-white">Brand</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {brandColors.map((color) => (
                <div key={color.name}>
                  <div className={`h-14 w-full ${color.className}`} />
                  <p className="mt-2 text-body-2 text-white">{color.name}</p>
                  <p className="text-body-3 text-brand-gray-300">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-body-2 text-brand-gray-300">Font</p>
            <h1 className="mt-1 text-headline-2">Fonts</h1>

            <h2 className="mt-6 text-headline-4 text-white">Headline</h2>
            <div className="mt-3 space-y-2 text-brand-gray-300">
              <p className="text-headline-1">Headline1</p>
              <p className="text-headline-2">Headline 2</p>
              <p className="text-headline-3">Headline 3</p>
              <p className="text-headline-4">Headline 4</p>
            </div>

            <h2 className="mt-6 text-headline-4 text-white">Body</h2>
            <div className="mt-3 space-y-2 text-brand-gray-300">
              <p className="text-body-1-bold">Body 1 - Medium</p>
              <p className="text-body-1">Body 1 - Regular</p>
              <p className="text-body-2-bold">Body 2 - Medium</p>
              <p className="text-body-2">Body 2 - Regular</p>
              <p className="text-body-3">Body 3</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <InputField
              label="Label"
              placeholder="Placeholder"
              text={search}
              textTrue="Correct text"
              textFalse="Incorrect text"
              onChange={setSearch}
              correct={true}
              onClear={() => {
                setSearch("");
              }}
            />

            <InputField
              label="Label"
              placeholder="Placeholder"
              text={search}
              textTrue="Correct text"
              textFalse="Incorrect text"
              onChange={setSearch}
              correct={false}
              onClear={() => {
                setSearch("");
              }}
            />

            <InputField
              label="Label"
              placeholder="Placeholder"
              text={search}
              textTrue="Correct text"
              textFalse="Incorrect text"
              onChange={setSearch}
              correct={true}
              search={true}
              onSearch={() => {
                console.log("Search");
              }}
              onClear={() => {
                setSearch("");
              }}
            />

            <InputField
              label="Label"
              placeholder="Placeholder"
              text={search}
              textTrue="Correct text"
              textFalse="Incorrect text"
              onChange={setSearch}
              correct={false}
              search={true}
              onSearch={() => {
                console.log("Search");
              }}
              onClear={() => {
                setSearch("");
              }}
            />

            <InputField
              label="Label"
              placeholder="Placeholder"
              text={search}
              textTrue="Correct text"
              textFalse="Incorrect text"
              onChange={setSearch}
              correct={true}
              search={true}
              onSearch={() => {
                console.log("Search");
              }}
              onClear={() => {
                setSearch("");
              }}
              disabled={true}
            />

          </div>

          <div>
            <TextArea
              label="Label"
              placeholder="Placeholder"
              value={textArea}
              onChange={setTextArea}
            />
          </div>
        </section>

        <section className="mt-16 space-y-10 rounded-lg border border-brand-gray-100 p-6">

          <div>
            <p className="text-body-2 text-brand-gray-300">Alert</p>
            <h1 className="mt-1 text-headline-2">Alert </h1>
          </div>

          {/* 🔥 NEW: Alert Test */}
          <div className="space-y-4">
            <Alert
              type="error"
              title="Attention needed"
              message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar. "
              onClose={() => {
                console.log("Alert closed!");
              }}
            />

            <Alert
              type="success"
              title="Attention needed"
              message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar. "
              onClose={() => {
                console.log("Alert closed!");
              }}
            />
          </div>

          <div>
            <p className="text-body-2 text-brand-gray-300">Step</p>
            <h1 className="mt-1 text-headline-2">Step</h1>
          </div>

          {/* 🔥 NEW: Step Test */}
          <Step
            steps={[
              { label: "Account" },
              { label: "Profile" },
              { label: "Confirm" },
            ]}
            currentStep={2}
          />

          <div className="min-h-100 px bg-brand-gray-0 text-white p-10 space-y-8">

            <h1 className="text-headline-2">Checkbox</h1>

            <div className="space-y-6">

              <Checkbox
                label="Option 1"
                checked={checkboxes.option1}
                onChange={(e) =>
                  setCheckboxes({
                    ...checkboxes,
                    option1: e.target.checked,
                  })
                }
              />

              <Checkbox
                label="Option 2"
                checked={checkboxes.option2}
                onChange={(e) =>
                  setCheckboxes({
                    ...checkboxes,
                    option2: e.target.checked,
                  })
                }
              />

              <Checkbox
                label="Option 3"
                checked={checkboxes.option3}
                onChange={(e) =>
                  setCheckboxes({
                    ...checkboxes,
                    option3: e.target.checked,
                  })
                }
              />

              <Checkbox
                label="Disabled"
                checked={false}
                disabled
              />

            </div>

            <h1 className="text-headline-2 mt-10">Radio</h1>

            <Radio
              label="Option 1"
              name="group"
              value="1"
              checked={selected === "1"}
              onChange={(e) => setSelected(e.target.value)}
            />

            <Radio
              label="Option 2"
              name="group"
              value="2"
              checked={selected === "2"}
              onChange={(e) => setSelected(e.target.value)}
            />

            <Radio
              label="Option 3"
              name="group"
              value="3"
              checked={selected === "3"}
              onChange={(e) => setSelected(e.target.value)}
            />

            <Radio
              label="Disabled"
              name="group"
              value="4"
              checked={false}
              disabled
            />
          </div>


        </section>
        <section className="lg:col-span-6" />
      </div>

      {/* button */}
      <div className="flex">
        <div>
          <Button variant="primary">Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="text">Button</Button>
        </div>
        <div>
          <Button variant="primary" disabled={true}>
            Button
          </Button>
          <Button variant="secondary" disabled={true}>
            Button
          </Button>
          <Button variant="text" disabled={true}>
            Button
          </Button>
        </div>
      </div>

      {/* modal */}
      <Button variant="primary" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </Button>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={handlePageChange}
      />

      {/* tabs */}
      <div className="p-10 bg-brand-gray-0">
        {/* 2. ส่ง State และฟังก์ชัน Set State เข้าไปใน Tabs */}
        <Tabs
          tabs={tabItems}
          activeTab={currentTab}
          onChange={(id) => setCurrentTab(id)}
        />

        {/* แสดงเนื้อหาตาม Tab ที่เลือก */}
        <div className="mt-8 text-white p-6 bg-brand-gray-100/10 rounded-lg">
          {currentTab === "tab1" && <div>นี่คือเนื้อหาของ ข้อมูลทั่วไป</div>}
          {currentTab === "tab2" && <div>หน้านี้ไว้สำหรับ ตั้งค่าระบบ</div>}
          {currentTab === "tab3" && (
            <div>แสดงรายการ ประวัติการใช้งาน ทั้งหมด</div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Title"
        primaryActionButton="primary" // มี หรือ ไม่มี ก็ได้
        secondaryActionButton="secondary" // มี หรือ ไม่มี ก็ได้
        onPrimaryAction={() => console.log("Primary Click")} // ตรงนี้ เพิ่มฟังชั่นเข้าไปได้ว่า onclick จะทำอะไรต่อ
        onSecondaryAction={() => setIsModalOpen(false)}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id
        ante vitae eros suscipit pulvinar.
      </Modal>

      {/* MenuLink and Tag Examples */}
      <div className="space-y-8">
        <div>
          <h2 className="text-headline-2 mb-4">MenuLink & Tag Components</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-headline-4 mb-3">MenuLink Examples</h3>
              <div className="space-y-2">
                <MenuLink
                  icon={<UserRound size={24} strokeWidth={0.5}/>}
                  label="Dashboard"
                  onClick={() => console.log("Navigate to dashboard")}
                />
                <MenuLink
                  icon={<UserRound size={24} strokeWidth={0.5}/>}
                  label="Profile"
                  onClick={() => console.log("Navigate to profile")}
                />
                <MenuLink
                  icon={<UserRound size={24} strokeWidth={0.5}/>}
                  label="Settings"
                  variant="selected"
                />
              </div>
            </div>

            <div>
              <h3 className="text-headline-4 mb-3">Tag Examples</h3>
              <div className="flex flex-wrap gap-2">
                <Tag label="Active" variant="genre" />
                <Tag label="Pending" variant="language" />
                <Tag label="Completed" variant="genre" />
                <Tag label="JavaScript" variant="language" />
                <Tag label="TypeScript" variant="language" />
              </div>
            </div>

            <div>
              <h3 className="text-headline-4 mb-3">Combined Example</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MenuLink
                    icon={<UserRound size={24} strokeWidth={0.5} />}
                    label="User Management"
                    onClick={() => console.log("Navigate to users")}
                  />
                  <Tag label="5 new" variant="genre" />
                </div>
                <div className="flex items-center gap-2">
                  <MenuLink
                    icon={<UserRound size={24} strokeWidth={0.5} />}
                    label="Notifications"
                    onClick={() => console.log("Navigate to notifications")}
                  />
                  <Tag label="3" variant="language" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
