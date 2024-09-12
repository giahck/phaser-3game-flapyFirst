package com.ThreeGame.ThreeGame.cv.controller;

import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.cv.service.CvService;
import com.ThreeGame.ThreeGame.exeptions.exeptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cv")
public class CvController {
    @Autowired
    private CvService cvService;
   @PostMapping("/save")
    public cvDto saveCv(@RequestBody @Validated cvDto cv, BindingResult bindingResult) throws InterruptedException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return cvService.saveCv(cv);
    }

    @GetMapping("/all")
    public List<cvDto> findAll() {
        return cvService.findAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/{id}")
    public cvDto findById(@PathVariable Long id) {
        return cvService.findByUserId(id);
    }
}
