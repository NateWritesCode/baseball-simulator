import { Menu } from "@ark-ui/react/menu";

const NavItemMenu = () => {
   return (
      <Menu.Root>
         <Menu.Trigger>Teams</Menu.Trigger>
         <Menu.Positioner>
            <Menu.Content>
               <Menu.Item id="react">React</Menu.Item>
               <Menu.Item id="solid">Solid</Menu.Item>
               <Menu.Item id="vue">Vue</Menu.Item>
            </Menu.Content>
         </Menu.Positioner>
      </Menu.Root>
   );
};

export default NavItemMenu;
