<script>
	import Icon from "@iconify/svelte";

    export let checked = false;
  
    function toggleCheck() {
      checked = !checked;
    }
  </script>
  
  <style>
    .checkbox-wrapper {
      display: flex;
      align-items: center;
      position: relative;
      width: 32px;
      height: 32px;
    }
  
    .checkbox {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: transparent;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s, border-color 0.3s;
    }
  
    .checkbox.checked {
      background-color: #059669;
      border-color: #053d2b;
    }
</style>
  
<button 
    class="checkbox-wrapper text-emerald-600" 
    on:click={toggleCheck} 
    aria-label="checkbox"
    type="button"
  >
    <div class:checked={checked} class="checkbox border-2 border-slate-500">
      <span class="icon">
        <Icon icon="weui:done2-outlined" class="text-3xl {checked ? "text-slate-200" : "hidden"}" />
      </span>
    </div>
</button>
  